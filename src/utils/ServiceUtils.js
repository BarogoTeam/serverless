import _ from 'lodash';

export default class ServiceUtils {
  static toCamelCaseKeys(node) {
    if (node instanceof Array) {
      return _.map(node, ServiceUtils.toCamelCaseKeys);
    }
    if (node instanceof Object) {
      return _.mapValues(
        _.mapKeys(node, (v, k) => _.camelCase(k)),
        ServiceUtils.toCamelCaseKeys
      );
    }
    return node;
  }
  static toSnakeCaseKeys(node) {
    if (node instanceof Array) {
      return _.map(node, ServiceUtils.toSnakeCaseKeys);
    }
    if (node instanceof Object) {
      return _.mapValues(
        _.mapKeys(node, (v, k) => _.snakeCase(k)),
        ServiceUtils.toSnakeCaseKeys
      );
    }
    return node;
  }

  static applyMiddleware(fn) {
    return (event, context, callback) => {
      context.callbackWaitsForEmptyEventLoop = false;

      fn(event)
        .then(response =>
          callback(
            null,
            _.assign({}, response, {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
              },
            })
          )
        )
        .catch(e =>
          callback(null, {
            statusCode: 502,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
              errorMessage: e.message,
            }),
          })
        );
    };
  }
}
