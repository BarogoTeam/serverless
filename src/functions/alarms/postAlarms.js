import jwt from 'jsonwebtoken';
import DatabaseUtils from '../../utils/DatabaseUtils';

export default async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const alarm = JSON.parse(event.body);
  const token = event.headers.Authorization.split(' ')[1]; // TODO: 재연이가 고쳐줄것임
  alarm.email = jwt.verify(token, 'secret').data;

  const response = new Promise(resolve => {
    DatabaseUtils.connectMongoDB().then(db =>
      db.collection('alarms').insertOne(alarm)
    );
    resolve({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({
        message: 'Created',
      }),
    });
  });

  callback(null, await response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
