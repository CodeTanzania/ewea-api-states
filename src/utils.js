import camelCase from 'lodash/camelCase';
import forIn from 'lodash/forIn';
import get from 'lodash/get';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import { pluralize } from 'inflection';

/**
 * @function
 * @name camelize
 * @description Joins names and generate camelCase of joined words them
 *
 * @param {...string} words list of words to join and camelize
 * @returns {string} camelCase of joined words
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function camelize(...words) {
  return camelCase([...words].join(' '));
}

/**
 * @function
 * @name wrapActionsWithDispatch
 * @description Wrap actions with dispatch function. Make users to just
 * invoke actions without have to dispatch them.
 *
 * @param {object} actions list of redux actions
 * @param {Function} dispatch store dispatch function
 * @returns {object} map of redux action wrapped with dispatch function
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function wrapActionsWithDispatch(actions, dispatch) {
  const wrappedActions = {};

  forIn(actions, (fn, key) => {
    wrappedActions[key] = (...params) => dispatch(fn(...params));
  });

  return wrappedActions;
}

/**
 * @function
 * @name extractReducers
 * @description Extract all resource reducers into a single object
 * @param {string[]} resources list of exposed API resources
 * @param {object[]} slices list of resource slices
 * @returns {object} map of all resources reducers
 * @version 0.1.0
 * @since 0.1.0
 */
export function extractReducers(resources, slices) {
  const reducers = {};

  // reducers
  resources.forEach((resource) => {
    reducers[pluralize(resource)] = slices[resource].reducer;
  });

  return reducers;
}

/**
 * @function
 * @name extractReportReducers
 * @description Extract all resource reducers into a single object
 * @param {string[]} reports list of exposed API reports
 * @param {object[]} slices list of resource slices
 * @returns {object} map of all reports reducers
 * @version 0.1.0
 * @since 0.20.0
 */
export function extractReportReducers(reports, slices) {
  const reducers = {};

  reports.forEach((report) => {
    reducers[`${pluralize(report)}Report`] = slices[`${report}Report`].reducer;
  });

  return reducers;
}

/**
 * @function
 * @name extractActions
 * @description Extracts all actions from all slices into into a single object
 * @param {string[]} resources list of api resources
 * @param {object[]} slices  list of all resources slices
 * @param {boolean} isReportActions Flag to indicate extracting report actions
 *  from slice
 * @returns {object} map of all resources actions
 * @version 0.1.0
 * @since 0.1.0
 */
export function extractActions(resources, slices, isReportActions = false) {
  const actions = {};

  resources.forEach((resource) => {
    const key = isReportActions ? `${resource}Report` : resource;
    actions[key] = slices[key].actions;
  });

  return actions;
}

/**
 * @function
 * @name normalizedError
 * @description normalize error object from the client to be stored in redux
 * store
 *
 * @param {object} error error object from the client
 * @returns {object} normalizedError Error object with normalized messages
 *
 * @version 0.1.0
 * @since 0.10.2
 */
export function normalizeError(error) {
  const normalizedError = cloneDeep(error);
  const errors = get(normalizedError, 'errors', null);

  if (errors) {
    forIn(errors, (value, key) => {
      errors[key] = `${value.name} : ${value.message}`;
    });

    normalizedError.errors = errors;
  }

  return normalizedError;
}

/**
 * @function
 * @name getPartyPermissionsWildcards
 * @description Extract wildcards from party permissions
 * @param {object} party Authenticated party
 * @returns {string[]} Wildcards extracted from permissions
 * @version 0.1.0
 * @since 0.30.0
 */
export function getPartyPermissionsWildcards(party) {
  const permissions = get(party, 'role.relations.permissions', []);
  return map(permissions, 'wildcard');
}
