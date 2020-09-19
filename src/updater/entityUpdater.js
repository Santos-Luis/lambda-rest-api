const { getEntityById, updateEntity } = require('../repository/entityRepository');
const { entityCreationValidator } = require('../validator/entityCreationValidator');

module.exports.entityUpdate = async ( oldEntityId, newAttributes ) => {
  const {
    maker,
    model,
    year,
    color,
    monthly,
    available_from
  } = newAttributes;
  
  const updatedAttributes = {
    'maker': maker,
    'model': model,
    'year': year,
    'color': color,
    'monthly': monthly,
    'available_from': available_from
  };

  const oldEntity = await getEntityById(oldEntityId);
  let newEntity = { id: oldEntity.id };

  Object.keys(updatedAttributes).forEach(key => {
    const value = updatedAttributes[key];
    if (value) {
      return newEntity[key] = value;
    }
    
    return newEntity[key] = oldEntity[key];
  });

  const { isValid, error: validationError } = entityCreationValidator(newEntity);
  if (!isValid) {
    throw validationError;
  }

  return updateEntity(newEntity);
};
