import jwt from 'jsonwebtoken';
import DatabaseUtils from '../../utils/DatabaseUtils';
import ServiceUtils from '../../utils/ServiceUtils';

async function signIn(event) {
  const db = await DatabaseUtils.connectMongoDB();
  const user = JSON.parse(event.body);

  const query = {
    email: user.email,
    password: user.password,
  };
  const cnt = await db
    .collection('users')
    .find(query)
    .count();

  if (cnt === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errorMessage: 'Failed to authenticate',
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      jwt.sign({ data: user.email }, 'secret', { expiresIn: '24h' })
    ),
  };
}

export default ServiceUtils.applyMiddleware(signIn);
