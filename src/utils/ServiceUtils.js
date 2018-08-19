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
}
