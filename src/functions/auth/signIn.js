import jwt from 'jsonwebtoken';
import DatabaseUtils from '../../utils/DatabaseUtils';

export default async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const response = new Promise(resolve => {
    DatabaseUtils.connectMongoDB().then(db => {
      const user = JSON.parse(event.body);
      const query = {
        email: user.email,
        password: user.password,
      };
      db.collection('users')
        .find(query)
        .count()
        .then(cnt => {
          if (cnt) {
            resolve({
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify(
                jwt.sign({ data: user.email }, 'secret', { expiresIn: '24h' })
              ),
            });
          } else {
            resolve({
              statusCode: 400,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
              },
              body: JSON.stringify({
                errorMessage: 'Failed to authenticate',
              }),
            });
          }
        });
    });
  });

  callback(null, await response);
};
