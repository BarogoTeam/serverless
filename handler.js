const DatabaseUtils = require("./DatabaseUtils").default;

'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};


module.exports.getAlarms = async function(event, context, callback) {
  const db = await DatabaseUtils.connectMongoDB()

  new Promise((resolve, reject) => {
    db.collection('alarms').find({}).toArray((err, alarms) => {
      if (err) {
        reject(err)
      }
      resolve(alarms)
    })

  }).then((alarms) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        alarms
      }),
    });
  }).catch((e) => {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        messages: [e.message]
      }),
    });
  })
};
