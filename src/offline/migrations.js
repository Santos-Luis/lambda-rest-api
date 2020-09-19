import AWS from 'aws-sdk';
import promise from 'bluebird';
import fs from 'fs';
import path from 'path';

AWS.config.setPromisesDependency(promise);

export default populateDB = async () => {
  const options = getOptions();
  const dynamodbTable = process.env.JEST_WORKER_ID ? 'test-entities' : 'dev-entities';

  const dynamodb = new AWS.DynamoDB.DocumentClient(options);
  
  const fixturesFile = fs.readFileSync(
    path.join(__dirname, 'fixtures.json'),
    'utf8'
  );
  fixtures = JSON.parse(fixturesFile);
  
  let promises = [];
  fixtures.forEach((item, index) => {
    item.id = `fake-id-${index}`;
    const params = {
      TableName: dynamodbTable,
      Item: item
    };
    promises.push(dynamodb.put(params).promise());
  });
  
  await Promise.all(promises);
};

const getOptions = () => {
  if (process.env.JEST_WORKER_ID) {
    return {
      endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
      region: 'local',
      sslEnabled: false
    };
  }

  return {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'MOCK_ACCESS_KEY_ID',
    secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
  };
};
