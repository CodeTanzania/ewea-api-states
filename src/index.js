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
export * from './actions/agency';
export {
  wrappedInitializeApp as initializeApp,
  wrappedSingin as signin,
  wrappedSingout as signout,
} from './actions/app';
export * from './actions/administrativeArea';
export * from './actions/changelog';
export * from './actions/event';
export * from './actions/eventAction';
export * from './actions/eventCertainty';
export * from './actions/eventFunction';
export * from './actions/eventGroup';
export * from './actions/eventQuestion';
export * from './actions/eventSeverity';
export * from './actions/eventType';
export * from './actions/feature';
export * from './actions/focalPerson';
export * from './actions/notificationTemplate';
export * from './actions/partyRole';
