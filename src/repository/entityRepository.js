import dynamodb from '../infrastructure/dynamodb';
import { v1 as uuid } from 'uuid';

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

export const getEntities = async (queryStringParameters, lastItem) => {
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

    return paginate(sortedItems, lastItem);
  });
};

export const addNewEntity = async entityObject => {
  const entityItem = createEntityItem(entityObject);
  const params = { TableName: process.env.ENTITIES_TABLE, Item: entityItem };

  return dynamodb.put(params).promise().then(() => entityItem);
};

export const getEntityById = async id => {
  const params = {
    TableName: process.env.ENTITIES_TABLE,
    Key: {
      id
    }
  };

  return dynamodb.get(params).promise().then(({ Item }) => Item);
};

export const updateEntity = async entityItem => {
  const params = { TableName: process.env.ENTITIES_TABLE, Item: entityItem };

  return dynamodb.put(params).promise().then(() => entityItem);
};

const getSortedParams = (results, sort) => {
  return results.sort((r1, r2) => r1[sort] > r2[sort] ? 1 : -1);
};

// we can't use the previous method to price since, e.g., '20' > '100'
const getSortedByPrice = results => {
  return results.sort((e1, e2) => {
    return parseInt(e1.monthly) > parseInt(e2.monthly) ? 1 : -1;
  });
};

const createEntityItem = ({
  maker,
  model,
  year,
  color,
  monthly,
  availability
}) => {
  const timestamp = new Date().getTime();

  return {
    id: uuid(),
    createdAt: timestamp,
    maker,
    model,
    year,
    color,
    monthly,
    availability: getCorrectDateFormat(availability)
  };
};

/**
 * we are doing manual pagination since dynamodb doesn't
 * handle our use case (scans with filters and pagination)
 * very well
 */
const paginate = (results, lastItem) => {
  if (results.length <= PAGE_SIZE) {
    return { entities: results };
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
