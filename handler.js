const DatabaseUtils = require("./DatabaseUtils").default;

'use strict';

module.exports.getCinemas = async function(event, context, callback) {
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
