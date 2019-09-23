import forIn from 'lodash/forIn';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { store } from './store';

/**
 * @function
 * @name StoreProvider
 * @description Store Provider for EMIS store
 *
 * @param {object} props react nodes
 * @param {object} props.children react nodes
 * @returns {object} Store provider
 * @version 0.1.0
 * @since 0.1.0
 * @example
 * import {StoreProvider} from '@codetanzania/emis-api-states';
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
    mapStateToProps = state => {
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
export * from './actions/activity';
export * from './actions/adjustment';
export * from './actions/agency';
export * from './actions/alert';
export * from './actions/alertSource';
export {
  wrappedInitializeApp as initializeApp,
  wrappedSingin as signin,
  wrappedSingout as signout,
} from './actions/app';
export * from './actions/assessment';
export * from './actions/campaign';
export * from './actions/district';
export * from './actions/feature';
export * from './actions/focalPerson';
export * from './actions/incident';
export * from './actions/incidentType';
export * from './actions/indicator';
export * from './actions/item';
export * from './actions/itemCategory';
export * from './actions/itemUnit';
export * from './actions/message';
export * from './actions/plan';
export * from './actions/procedure';
export * from './actions/question';
export * from './actions/questionnaire';
export * from './actions/region';
export * from './actions/resource';
export * from './actions/role';
export * from './actions/stock';
export * from './actions/warehouse';
