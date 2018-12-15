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
  const CRAWLER_ID = 'ZupzupCrawler@zupzup.com';

  const isCrawler = email => email === CRAWLER_ID;

  const response = new Promise(resolve => {
    try {
      const email = jwt.verify(token, 'secret').data; // TODO: jwt가 valid하지 않은 경우 처리
      const query = isCrawler(email) ? {} : { email };

      DatabaseUtils.connectMongoDB()
        .then(db =>
          db
            .collection('alarms')
            .find(query)
            .toArray()
        )
        .then(alarms => {
          resolve({
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*', // Required for CORS support to work
              'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(alarms),
          });
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
};
