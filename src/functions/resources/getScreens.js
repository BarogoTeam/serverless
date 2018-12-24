import _ from 'lodash';
import moment from 'moment';

import LotteCinemaService from '../../services/LotteCinemaService';

export default (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { cinemaIds, alarmDate = moment().format('YYYY-MM-DD') } =
    _.get(event, 'queryStringParameters') || {};

  LotteCinemaService.getScreens(alarmDate, cinemaIds)
    .then(body =>
      callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(body),
      })
    )
    .catch(e => {
      callback(null, {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(e.message),
      });
    });
};
