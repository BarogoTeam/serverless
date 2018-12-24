import _ from 'lodash';

import LotteCinemaService from '../../services/LotteCinemaService';

export default (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { cinemaId, screenId, playDate } =
    _.get(event, 'queryStringParameters') || {};

  LotteCinemaService.getSeats(cinemaId, screenId, playDate)
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
