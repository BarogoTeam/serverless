import LotteCinemaService from '../../services/LotteCinemaService';
import ServiceUtils from '../../utils/ServiceUtils';

async function getCinemas() {
  const cinemas = await LotteCinemaService.getCinemas();
  return {
    statusCode: 200,
    body: JSON.stringify(cinemas),
  };
}

export default ServiceUtils.applyMiddleware(getCinemas);
