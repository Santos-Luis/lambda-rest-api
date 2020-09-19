const { addNewEntity } = require('../repository/entityRepository');
const { entityCreationValidator } = require('../validator/entityCreationValidator');

/**
 * Creates a new entity based on given parameters.
 * The body must contain the following params
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
module.exports.create = (event, _, callback) => {
  const requestBody = JSON.parse(event.body);
  const { isValid, error: validationError } = entityCreationValidator(requestBody);

  if (!isValid) {
    return callback(
      null,
      {
        statusCode: 400,
        body: JSON.stringify({ validationError })
      }
    )
  }

  return addNewEntity(requestBody).then(({ id }) => {
    callback(
      null,
      {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Successfully created the given entity',
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
          message: `Unable to create the given entity: ${error}`
        })
      }
    );
  });
};
