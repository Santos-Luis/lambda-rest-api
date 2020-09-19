const dynamodb = require('../infrastructure/dynamodb');
const uuid = require('uuid');

const ENTITY_ATTRIBUTES = [
  'id',
  'maker',
  'model',
  '#yr', // 'year' is a reserved keyword on dynamoDB *
  'color',
  'monthly',
  'availability'
];
const PAGE_SIZE = 20;

module.exports.getAllEntities = async (lastItem) => {
  const filterExpression = '#availability < :maxAvailability';
  const expressionAttributeNames = {
    '#yr': 'year', // * this "walkaround" is given has solution on the aws docs
    '#availability': 'availability'
  };
  const expressionAttributeValues = { ':maxAvailability': getMaxAvailability() };
  const params = {
    TableName: process.env.ENTITIES_TABLE,
    ProjectionExpression: ENTITY_ATTRIBUTES.join(', '),
    FilterExpression: filterExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  };

  return dynamodb.scan(params).promise().then(({ Items }) => (
    paginate(getSortedByPrice(Items), lastItem)
  ));
};

module.exports.getAllEntitiesFiltered = async (queryStringParameters, lastItem) => {
  let filterExpression = '#availability < :maxAvailability';
  let expressionAttributeNames = {
    '#yr': 'year', // * this "walkaround" is given has solution on the aws docs
    '#availability': 'availability'
  };
  let expressionAttributeValues = { ':maxAvailability': getMaxAvailability() };

  const { maker, color, sort } = queryStringParameters || {};
  if (maker) {
    filterExpression += ' and #maker = :maker';
    expressionAttributeNames['#maker'] = 'maker';
    expressionAttributeValues[':maker'] = maker;
  }

  if (color) {
    filterExpression += ' and #color = :color';
    expressionAttributeNames['#color'] = 'color';
    expressionAttributeValues[':color'] = color;
  }

  const params = {
    TableName: process.env.ENTITIES_TABLE,
    ProjectionExpression: ENTITY_ATTRIBUTES.join(', '),
    FilterExpression: filterExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  };

  return dynamodb.scan(params).promise().then(({ Items }) => {
    const sortedItems = !sort || sort === 'price'
      ? getSortedByPrice(Items)
      : getSortedParams(Items, sort);

    return paginate(sortedItems, lastItem)
  });
};

const getSortedParams = (results, sort) => {
  return results.sort((r1, r2) => r1[sort] > r2[sort] ? 1 : -1)
};

// we can't use the previous method to price since, e.g., '20' > '100'
const getSortedByPrice = results => {
  return results.sort((car1, car2) => {
    return parseInt(car1.monthly) > parseInt(car2.monthly) ? 1 : -1;
  });
};

/**
 * we are doing manual pagination since dynamodb doesn't
 * handle our use case (scans with filters and pagination)
 * very well
 */
const paginate = (results, lastItem) => {
  if (results.length <= PAGE_SIZE) {
    return { entity: results };
  }

  let lastItemIndex = 0;
  if (lastItem) {
    lastItemIndex = results.findIndex(result => {
      return result.id === lastItem;
    }) + 1;
  }

  const entitiesPaginated = results.slice(
    lastItemIndex,
    PAGE_SIZE + lastItemIndex
  );
  let response = { entities: entitiesPaginated };
  if (results.length > PAGE_SIZE && entitiesPaginated.length === PAGE_SIZE) {
    response.lastItem = results[PAGE_SIZE - 1].id;
  }
  
  return response;
};

/**
 * the following block of code gets the date of three months from now,
 * we are using Date.now() so we can mock it on tests
 */
const getMaxAvailability = () => {
  const now = new Date(Date.now());
  const maxAvailabilityTimestamp = new Date(Date.now()).setMonth(now.getMonth() + 3);

  return getCorrectDateFormat(maxAvailabilityTimestamp);
};

// returns the date in "YYYY-MM-DD" format
const getCorrectDateFormat = date => (
  new Date(date).toISOString().slice(0, 10)
);
