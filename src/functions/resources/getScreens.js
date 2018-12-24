import _ from 'lodash';
import moment from 'moment';

import LotteCinemaService from '../../services/LotteCinemaService';
import ServiceUtils from '../../utils/ServiceUtils';

async function getScreens(event) {
  const { cinemaIds, alarmDate = moment().format('YYYY-MM-DD') } =
    _.get(event, 'queryStringParameters') || {};

  const screens = await LotteCinemaService.getScreens(alarmDate, cinemaIds);

  return {
    statusCode: 200,
    body: JSON.stringify(screens),
  };
}

export default ServiceUtils.applyMiddleware(getScreens);
