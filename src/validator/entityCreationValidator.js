const possibleMakersAndModels = {
  'BMW': [
    'Series3',
    'X1'
  ],
  'Toyota': [
    'Yaris',
    'RAV4'
  ],
  'Renault': [
    'Clio',
    'Megane'
  ]
};
const FIRST_ENTITY_YEAR = '1885';

const validateYear = year => (
  year >= FIRST_ENTITY_YEAR && year <= new Date().getFullYear().toString()
);

const validateColor = color => typeof(color) === 'string';

const validateMonthly = monthly => monthly >= 100;

const validateAvailability = availability => Date.parse(availability);

export const entityCreationValidator = entity => {
  const {
    maker,
    model,
    year,
    color,
    monthly,
    availability
  } = entity;

  if (!(maker in possibleMakersAndModels)) {
    return {
      isValid: false,
      error: 'Maker not recognised'
    };
  }

  if (!possibleMakersAndModels[maker].includes(model)) {
    return {
      isValid: false,
      error: 'Model not recognised for the given maker'
    };
  }

  if (!validateYear(year)) {
    return {
      isValid: false,
      error: `Invalid year given, it must be between 1885 and ${new Date().getFullYear()}`
    };
  }

  if (!validateColor(color)) {
    return {
      isValid: false,
      error: 'Invalid color given, you should provide a valid string'
    };
  }

  if (!validateMonthly(monthly)) {
    return {
      isValid: false,
      error: 'Invalid monthly given, you should provide a number higher than 100'
    };
  }

  if (!validateAvailability(availability)) {
    return {
      isValid: false,
      error: 'Invalid availability given, you should provide a correct date format'
    };
  }

  return { isValid: true };
};
