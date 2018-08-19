import LotteCinemaService from '../../services/LotteCinemaService';

export const getScreens = (event, context, callback) => {
  LotteCinemaService.getScreens(
    event.queryStringParameters.alarmDate,
    event.queryStringParameters.cinemaIds
  )
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
