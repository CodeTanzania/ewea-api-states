import { singularize } from 'inflection';
import get from 'lodash/get';
import merge from 'lodash/merge';
import upperFirst from 'lodash/upperFirst';
import { camelize, wrapActionsWithDispatch } from '../utils';
import createThunkFor from './thunk';

/**
 * @function
 * @name generateExposedActions
 * @description Generate all actions which are exposed from the library for
 * consumers to use. All exposed actions are wrapped in dispatch function so
 * use should not have call dispatch again.
 *
 * @param {string} resource Resource Name
 * @param {object} actions Resources actions
 * @param {Function} dispatch Store action dispatcher
 * @param {object} thunks Custom thunks to override/extends existing thunks
 * @returns {object} wrapped resource actions with dispatching ability
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export default function generateExposedActions(
  resource,
  actions,
  dispatch,
  thunks = null
) {
  const resourceName = singularize(upperFirst(resource));

  const generatedThunks = createThunkFor(resourceName);

  merge(generatedThunks, thunks);

  const extractedActions = {};

  extractedActions[camelize('select', resourceName)] = get(
    actions[resource],
    camelize('select', resourceName)
  );

  extractedActions[camelize('open', resourceName, 'form')] = get(
    actions[resource],
    camelize('open', resourceName, 'form')
  );

  extractedActions[camelize('close', resourceName, 'form')] = get(
    actions[resource],
    camelize('close', resourceName, 'form')
  );

  extractedActions[camelize('set', resourceName, 'schema')] = get(
    actions[resource],
    camelize('set', resourceName, 'schema')
  );

  const allActions = merge({}, extractedActions, generatedThunks);

  return wrapActionsWithDispatch(allActions, dispatch);
}
