const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const isLocal = !process.env.AWS_REGION;

const client = new DynamoDBClient({
  ...(isLocal && {
    endpoint: 'http://localhost:8000',
    region: 'local',
    credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
  }),
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = docClient;
