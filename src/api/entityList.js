import { getAllEntities, getAllEntitiesFiltered, getEntities } from '../repository/entityRepository';

/**
 * List all the item based on the filters given/or not. If no filter is passed
 * the results are the first 20 valid entities, available on the next three months,
 * sorted by price.
 *
 * All the filters must be passed as query params, being as follow:
 *
 * @param lastItem  when the result given it's bigger then 20 items, the service
 *                  returns the result and the next id, so we can start fetching
 *                  the next results from there - pagination
 * @param sort      must be either: price, year, maker or availability
 * @param maker     filter the results by maker
 * @param color     filter the results by color
 */
export const listAll = async (event, _, callback) => {
  const { queryStringParameters } = event;
  const { lastItem } = queryStringParameters || {};
  if (lastItem) {
    delete queryStringParameters.lastItem;
  }

  return await getEntities(queryStringParameters, lastItem).then(results => {
    callback(
      null,
      {
        statusCode: 200,
        body: JSON.stringify(results)
      }
    );
  }).catch(error => {
    callback(
      null,
      {
        statusCode: 500,
        body: JSON.stringify({
          message: `Error fetching all entities: ${error}`
        })
      }
    );
  });
};
