export default (event, context, callback) => {
  callback(null, {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: {},
  });
};
