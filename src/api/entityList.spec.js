const { listAll } = require('./entityList');
const { populateDB } = require('../offline/migrations');

Date.now = jest.spyOn(Date, 'now').mockImplementation(() => {
  return new Date('2020-09-01');
})
process.env.ENTITIES_TABLE = 'test-entities';

test('it list entities with pagination', async () => {
  await populateDB();
  const callback = jest.fn((error, response) => {});

  await listAll({}, {}, callback);

  const { entities, lastItem } = JSON.parse(callback.mock.calls[0][1]['body']);

  expect(entities.length).toBe(20);
  expect(lastItem).toBe('fake-id-29');
});

test('it list entities in the second page', async () => {
  await populateDB();
  const callback = jest.fn((error, response) => {});

  const event = {
    queryStringParameters: {
      lastItem: 'fake-id-29'
    }
  };

  await listAll(event, {}, callback);

  const { entities } = JSON.parse(callback.mock.calls[0][1]['body']);

  expect(entities.length).toBe(4);
});

test('it list entities from lowest to highest monthly', async () => {
  await populateDB();
  const callback = jest.fn((error, response) => {});

  await listAll({}, {}, callback);

  const { entities } = JSON.parse(callback.mock.calls[0][1]['body']);

  expect(parseInt(entities[0].monthly))
    .toBeLessThanOrEqual(parseInt(entities[5].monthly));
  expect(parseInt(entities[6].monthly))
    .toBeLessThanOrEqual(parseInt(entities[10].monthly));
  expect(parseInt(entities[11].monthly))
    .toBeLessThanOrEqual(parseInt(entities[15].monthly));
});

test('it list entities filtered by maker', async () => {
  await populateDB();
  const callback = jest.fn((error, response) => {});

  const event = {
    queryStringParameters: {
      maker: 'BMW'
    }
  };

  await listAll(event, {}, callback);

  const { entities } = JSON.parse(callback.mock.calls[0][1]['body']);
  const carFromGivenMaker = entities.find(({ maker }) => maker === 'BMW');
  const carFromAnotherMaker = entities.find(({ maker }) => maker === 'Toyota');

  expect(carFromGivenMaker).toBeInstanceOf(Object);
  expect(carFromAnotherMaker).toBeUndefined();
});

test('it list entities filtered by color', async () => {
  await populateDB();
  const callback = jest.fn((error, response) => {});

  const event = {
    queryStringParameters: {
      color: 'blue'
    }
  };

  await listAll(event, {}, callback);

  const { entities } = JSON.parse(callback.mock.calls[0][1]['body']);
  const carFromGivenColor = entities.find(({ color }) => color === 'blue');
  const carFromAnotherColor = entities.find(({ color }) => color === 'red');

  expect(carFromGivenColor).toBeInstanceOf(Object);
  expect(carFromAnotherColor).toBeUndefined();
});

test('it list entities filtered by maker and color', async () => {
  await populateDB();
  const callback = jest.fn((error, response) => {});

  const event = {
    queryStringParameters: {
      maker: 'Toyota',
      color: 'red'
    }
  };

  await listAll(event, {}, callback);

  const { entities } = JSON.parse(callback.mock.calls[0][1]['body']);
  const carFromGivenColorAndMaker = entities.find(({ maker, color }) => { 
    return maker === 'Toyota' && color === 'red';
  });
  const carFromAnotherColorAndMaker = entities.find(({ maker, color }) => { 
    return maker === 'BMW' && color === 'blue';
  });

  expect(carFromGivenColorAndMaker).toBeInstanceOf(Object);
  expect(carFromAnotherColorAndMaker).toBeUndefined();
});
