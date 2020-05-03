import forIn from 'lodash/forIn';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { store, resources, actions, dispatch, REPORTS } from './store';
import {
  generateExposedActions,
  generateReportExposedActions,
} from './factories/action';

/**
 * @function
 * @name StoreProvider
 * @description Store Provider for EWEA store
 *
 * @param {object} props react nodes
 * @param {object} props.children react nodes
 * @returns {object} Store provider
 * @version 0.1.0
 * @since 0.1.0
 * @example
 * import {StoreProvider} from '@codetanzania/ewea-api-states';
 *
 * ReactDom.render(<StoreProvider><App /></StoreProvider>,
 * document.getElementById('root'));
 */
export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * @function
 * @name Connect
 * @description Expose simplified connect function
 *
 * This function subscribe component to the store and inject props
 * to the component
 *
 * @param {object} component react node
 * @param {object|Function} stateToProps states to inject into props
 * @returns {object} React component which is injected with props
 *
 * @version 0.1.0
 * @since 0.1.0
 * @example
 * function AlertList({alerts}){
 *  return (
 *  ... jsx stuff
 * );
 * }
 *
 * export Connect(AlertList,{alerts:'alerts.list'})
 */
export function Connect(component, stateToProps = null) {
  let mapStateToProps = stateToProps;

  if (!isFunction(stateToProps) && isObject(stateToProps)) {
    mapStateToProps = (state) => {
      const mappedState = {};

      forIn(stateToProps, (value, key) => {
        mappedState[key] = get(state, value);
      });

      return mappedState;
    };
  }

  return connect(mapStateToProps)(component);
}

/* Export resource actions */
export {
  wrappedInitializeApp as initializeApp,
  wrappedSignIn as signIn,
  wrappedSignOut as signOut,
} from './actions/app';

export const reduxActions = {};

forEach(resources, (resource) => {
  const generatedActions = generateExposedActions(resource, actions, dispatch);
  merge(reduxActions, generatedActions);
});

forEach(REPORTS, (report) => {
  const generatedReportActions = generateReportExposedActions(report, dispatch);
  merge(reduxActions, generatedReportActions);
});
