import _ from 'lodash';
import moment from 'moment';

import LotteCinemaService from '../../services/LotteCinemaService';
import ServiceUtils from '../../utils/ServiceUtils';

async function getSeats(event) {
  const { cinemaId, screenId, alarmDate = moment().format('YYYY-MM-DD') } =
    _.get(event, 'queryStringParameters') || {};

  const seats = await LotteCinemaService.getSeats(
    cinemaId,
    screenId,
    alarmDate
  );

  return {
    statusCode: 200,
    body: JSON.stringify(seats),
  };
}

export default ServiceUtils.applyMiddleware(getSeats);
