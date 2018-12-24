import DatabaseUtils from '../../utils/DatabaseUtils';
import ServiceUtils from '../../utils/ServiceUtils';

async function signUp(event) {
  const db = await DatabaseUtils.connectMongoDB();
  const user = JSON.parse(event.body);

  try {
    await db.collection('users').insertOne(user);
  } catch (e) {
    throw new Error(e.errmsg);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Created',
    }),
  };
}

export default ServiceUtils.applyMiddleware(signUp);
