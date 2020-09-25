import { getEntityById, updateEntity } from '../repository/entityRepository';
import { entityCreationValidator } from '../validator/entityCreationValidator';
import { validationException } from '../exceptions/validationException';

export const entityUpdate = async ( oldEntityId, newAttributes ) => {
  const {
    maker,
    model,
    year,
    color,
    monthly,
    availability
  } = newAttributes;

  const updatedAttributes = {
    'maker': maker,
    'model': model,
    'year': year,
    'color': color,
    'monthly': monthly,
    'availability': availability
  };

  const oldEntity = await getEntityById(oldEntityId);
  let newEntity = { id: oldEntity.id };

  Object.keys(updatedAttributes).forEach(key => {
    const value = updatedAttributes[key];
    newEntity[key] = value || oldEntity[key];
  });

  const { isValid, error: validationError } = entityCreationValidator(newEntity);
  if (!isValid) {
    throw validationException(validationError);
  }

  return updateEntity(newEntity);
};
