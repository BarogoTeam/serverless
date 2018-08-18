const MongoClient = require('mongodb').MongoClient


class DatabaseUtils {
  static connectMongoDB() {
    return MongoClient.connect(process.env.MONGODB)
      .then(client=>client.db())
  }
}

exports.default = exports.DatabaseUtils = DatabaseUtils
