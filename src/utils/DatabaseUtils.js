import MongoClient from 'mongodb';

export default class DatabaseUtils {
  static async connectMongoDB() {
    return MongoClient.connect(process.env.MONGODB).then(client => client.db());
  }
}
