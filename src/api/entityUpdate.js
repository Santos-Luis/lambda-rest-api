const { entityUpdate } = require('../updater/entityUpdater');

/**
 * Updates a given entity with the body passed. The id must passed on the
 * url /{id}, and the body must contain the attributes to update
 *
 * @param maker        must be either - BMW, Renault, Toyota
 * @param model        for BMW must be either - Series3, X1 - for Renault must be
 *                     either - Clio, Megane - for Toyota mus be either - Yaris, RAV4
 * @param year         must be between 1885 and the current year
 * @param color        must be a string
 * @param monthly      the subscription price: must be higher than 100, since we
 *                     are using the last 2 digits as decimal
 * @param availability when the entity is available for booking: must be a valid date
 */
module.exports.update = async (event, _, callback) => {
  const {
    pathParameters: {
      id: entityId
    },
    body
  } = event;

  return entityUpdate(entityId, JSON.parse(body)).then(({ id }) => {
    callback(
      null,
      {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Successfully updated the given entity',
          entityId: id
        })
      }
    );
  }).catch(error => {
    callback(
      null,
      {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to update the given entity: ${error}`
        })
      }
    );
  });
};
