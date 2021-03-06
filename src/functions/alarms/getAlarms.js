import jwt from 'jsonwebtoken';
import _ from 'lodash';

import DatabaseUtils from '../../utils/DatabaseUtils';
import ServiceUtils from '../../utils/ServiceUtils';

async function getAlarms(event) {
  if (!_.get(event, 'headers.authorization')) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        errorMessage: 'Login is required',
      }),
    };
  }

  const token = event.headers.authorization.split(' ')[1];
  const CRAWLER_ID = 'ZupzupCrawler@zupzup.com';
  const isCrawler = email => email === CRAWLER_ID;

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

  const query = isCrawler(email) ? {} : { email };
  const db = await DatabaseUtils.connectMongoDB();

  const alarms = await db
    .collection('alarms')
    .find(query)
    .toArray();

  const movies = await db
    .collection('movies')
    .find({})
    .toArray();

  const result = alarms.map(alarm =>
    Object.assign(
      {},
      alarm,
      movies.find(movie => movie.movieId === alarm.movieId)
    )
  );
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}

export default ServiceUtils.applyMiddleware(getAlarms);
