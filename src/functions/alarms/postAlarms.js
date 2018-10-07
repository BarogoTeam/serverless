import jwt from 'jsonwebtoken';
import _ from 'lodash';

import DatabaseUtils from '../../utils/DatabaseUtils';

export default async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!_.get(event, 'headers.Authorization')) {
    return callback(null, {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({
        errorMessage: 'Login is required',
      }),
    });
  }

  const token = event.headers.Authorization.split(' ')[1];
  const alarm = JSON.parse(event.body);

  const response = new Promise(resolve => {
    try {
      alarm.email = jwt.verify(token, 'secret').data; // TODO: jwt가 valid하지 않은 경우 처리
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
    } catch (e) {
      resolve({
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({
          errorMessage: e.message,
        }),
      });
    }
  });

  return callback(null, await response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
