import DatabaseUtils from '../../utils/DatabaseUtils';

export default async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const response = new Promise(resolve =>
    DatabaseUtils.connectMongoDB()
      .then(db =>
        db
          .collection('alarms')
          .find()
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
