import LotteCinemaService from '../../services/LotteCinemaService';
import ServiceUtils from '../../utils/ServiceUtils';

async function getScreenMovies() {
  const screenMovies = await LotteCinemaService.getScreenMovies();
  return {
    statusCode: 200,
    body: JSON.stringify(screenMovies),
  };
}

export default ServiceUtils.applyMiddleware(getScreenMovies);
