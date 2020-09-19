const { entityCreationValidator } = require('./entityCreationValidator');

let entity = {};
beforeEach(() => {
  entity = {
    'color': 'blue',
    'year': '2014',
    'monthly': '28000',
    'maker': 'Toyota',
    'model': 'RAV4',
    'availability': '2020-07-01'
  };
});

test('it validates entity as correct', () => {
  const { isValid } = entityCreationValidator(entity);
  expect(isValid).toBeTruthy();
});

test('it validates maker as incorrect', () => {
  entity.maker = 'wrongMaker';
  const { isValid } = entityCreationValidator(entity);
  expect(isValid).toBeFalsy();
});

test('it validates model as incorrect', () => {
  entity.model = 'wrongMode';
  const { isValid } = entityCreationValidator(entity);
  expect(isValid).toBeFalsy();
});

test('it validates year as incorrect', () => {
  entity.year = '1600';
  const { isValid } = entityCreationValidator(entity);
  expect(isValid).toBeFalsy();
});

test('it validates color as incorrect', () => {
  entity.color = 123;
  const { isValid } = entityCreationValidator(entity);
  expect(isValid).toBeFalsy();
});

test('it validates monthly as incorrect', () => {
  entity.monthly = '10';
  const { isValid } = entityCreationValidator(entity);
  expect(isValid).toBeFalsy();
});

test('it validates availability as incorrect', () => {
  entity.availability = 'not-a-date';
  const { isValid } = entityCreationValidator(entity);
  expect(isValid).toBeFalsy();
});
