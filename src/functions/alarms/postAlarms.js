import jwt from 'jsonwebtoken';
import _ from 'lodash';

import DatabaseUtils from '../../utils/DatabaseUtils';
import ServiceUtils from '../../utils/ServiceUtils';

async function postAlarms(event) {
  if (!_.get(event, 'headers.authorization')) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        errorMessage: 'Login is required',
      }),
    };
  }

  const token = event.headers.authorization.split(' ')[1];
  const alarm = JSON.parse(event.body);

  let email = '';
  try {
    email = jwt.verify(token, 'secret').data; // TODO: jwt가 valid하지 않은 경우 처리
  } catch (e) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        errorMessage: e.message,
      }),
    };
  }

  const db = await DatabaseUtils.connectMongoDB();
  await db.collection('alarms').insertOne(_.assign({}, alarm, { email }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Created',
    }),
  };
}

export default ServiceUtils.applyMiddleware(postAlarms);
