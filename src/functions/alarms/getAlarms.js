import jwt from 'jsonwebtoken';
import DatabaseUtils from '../../utils/DatabaseUtils';

export default async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const token = event.headers.Authorization.split(' ')[1]; // TODO: 재연이가 고쳐줄것임
  const email = jwt.verify(token, 'secret').data;
  const query = {
    email,
  };

  const response = new Promise(resolve =>
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
      })
  );

  callback(null, await response);
};
