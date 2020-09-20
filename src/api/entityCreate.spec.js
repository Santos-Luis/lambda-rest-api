import { create } from './entityCreate';

jest.mock('uuid', () => ({
  v1: jest.fn(() => 'fake-id-1')
}));

process.env.ENTITIES_TABLE = 'test-entities';

let entity = {};
beforeEach(() => {
  entity = {
    'color': 'blue',
    'year': '2019',
    'monthly': '9000',
    'maker': 'Renault',
    'model': 'Clio',
    'availability': '2020-07-01'
  };
});

test('it creates a correct entity', async () => {
  const callback = jest.fn((error, response) => {});
  const event = { body: JSON.stringify(entity) };

  await create(event, {}, callback);

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0]).toMatchObject([
    null,
    {
      statusCode: 200,
      body: JSON.stringify({
        'message': 'Successfully created the given entity',
        'entityId':'fake-id-1'
      })
    }
  ]);
});

test('it doesnt create due to incorrect maker', () => {
  entity.maker = 'wrongMaker';
  const event = { body: JSON.stringify(entity) };

  const callback = jest.fn((error, response) => {});

  create(event, {}, callback);

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0]).toMatchObject([
    null,
    {
      statusCode: 400,
      body: JSON.stringify({
        'validationError': 'Maker not recognised'
      })
    }
  ]);
});

test('it doesnt create due to incorrect model for maker', () => {
  entity.model = 'wrongMode';
  const event = { body: JSON.stringify(entity) };

  const callback = jest.fn((error, response) => {});

  create(event, {}, callback);

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0]).toMatchObject([
    null,
    {
      statusCode: 400,
      body: JSON.stringify({
        'validationError': 'Model not recognised for the given maker'
      })
    }
  ]);
});

test('it doesnt create due to incorrect year', () => {
  entity.year = '1600';
  const event = { body: JSON.stringify(entity) };

  const callback = jest.fn((error, response) => {});

  create(event, {}, callback);

  expect(callback.mock.calls.length).toBe(1);
  expect(callback.mock.calls[0]).toMatchObject([
    null,
    {
      statusCode: 400,
      body: JSON.stringify({
        'validationError': 'Invalid year given, it must be between 1885 and 2020'
      })
    }
  ]);
});
