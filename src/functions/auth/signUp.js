import DatabaseUtils from '../../utils/DatabaseUtils';

export default async (event, context, callback) => {
  const response = new Promise(resolve => {
    DatabaseUtils.connectMongoDB().then(db =>
      db
        .collection('users')
        .insertOne(JSON.parse(event.body))
        .then(() => {
          resolve({
            statusCode: 201,
            headers: {
              'Access-Control-Allow-Origin': '*', // Required for CORS support to work
              'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({
              message: 'Created',
            }),
          });
        })
        .catch(error => {
          resolve({
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*', // Required for CORS support to work
              'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({
              error,
            }),
          });
        })
    );
  });

  callback(null, await response);
};
