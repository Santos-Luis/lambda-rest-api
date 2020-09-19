import AWS from 'aws-sdk';
import promise from 'bluebird';

AWS.config.setPromisesDependency(promise);

let options = {};
// we enter here if we are running a local dynamodb
if (process.env.IS_OFFLINE) {
  const host = process.env.DYNAMODB_HOST || 'localhost';
  options = {
    region: 'localhost',
    endpoint: `http://${host}:8000`,
    accessKeyId: 'MOCK_ACCESS_KEY_ID',
    secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
  };
}

// we enter here if we are running tests
if (process.env.JEST_WORKER_ID) {
  options = {
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    region: 'local',
    sslEnabled: false
  };
}

export default new AWS.DynamoDB.DocumentClient(options);
