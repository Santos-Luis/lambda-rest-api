import { update } from './entityUpdate';
import { getEntityById } from '../repository/entityRepository';
import { populateDB } from '../offline/migrations';

process.env.ENTITIES_TABLE = 'test-entities';

test('it updates correctly the entity', async () => {
  await populateDB();

  const id = 'fake-id-2';
  const newModel = 'Clio';
  const newMonthly = '19000';
  const { model: oldModel, monthly: oldMonthly } = await getEntityById(id);

  expect(oldModel).toBe('Megane');
  expect(oldMonthly).toBe('20000');

  const callback = jest.fn((error, response) => {});
  const event = {
    pathParameters: {
      id
    },
    body: JSON.stringify({
      'model': newModel,
      'monthly': newMonthly
    })
  };

  await update(event, {}, callback);

  const { model, monthly } = await getEntityById(id);

  expect(model).toBe(newModel);
  expect(monthly).toBe(newMonthly);
});

test('it doesnt update the entity', async () => {
  await populateDB();

  const id = 'fake-id-15';
  const { model: oldModel } = await getEntityById(id);

  expect(oldModel).toBe('X1');

  const callback = jest.fn((error, response) => {});
  const event = {
    pathParameters: {
      id
    },
    body: JSON.stringify({
      'model': 'DummyModel'
    })
  };

  await update(event, {}, callback);

  const { model } = await getEntityById(id);

  expect(model).toBe('X1');
  expect(callback.mock.calls[0]).toMatchObject([
    null,
    {
      statusCode: 422,
      body: JSON.stringify({
        'message': 'Unable to update the given entity: Model not recognised for the given maker'
      })
    }
  ]);
});
