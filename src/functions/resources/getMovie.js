import _ from 'lodash';

import LotteCinemaService from '../../services/LotteCinemaService';
import ServiceUtils from '../../utils/ServiceUtils';

async function getMovie(event) {
  const { id } = _.get(event, 'pathParameters');
  const movie = await LotteCinemaService.getMovie(id);
  return {
    statusCode: 200,
    body: JSON.stringify(movie),
  };
}

export default ServiceUtils.applyMiddleware(getMovie);
