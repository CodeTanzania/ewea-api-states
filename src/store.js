import merge from 'lodash/merge';
import { combineReducers } from 'redux';
import { configureStore } from 'redux-starter-kit';
import { getAuthenticatedParty } from '@codetanzania/emis-api-client';
import createSliceFor from './factories/slice';
import { extractActions, extractReducers } from './utils';

/* application action types */
export const INITIALIZE_APP_START = 'app/initialize';
export const INITIALIZE_APP_SUCCESS = 'app/initializeSuccess';
export const INITIALIZE_APP_FAILURE = 'app/initializeFailure';
export const SIGNIN_APP_START = 'app/signin';
export const SIGNIN_APP_SUCCESS = 'app/signinSuccess';
export const SIGNIN_APP_FAILURE = 'app/signinFailure';
export const SIGNOUT = 'app/signout';

/* constants */
const appDefaultState = {
  loading: false,
  signing: false,
  error: null,
  party: getAuthenticatedParty(),
};

/**
 * @function
 * @name createResourcesSlices
 * @description Create slices from all EMIS resources
 *
 * @param {string[]} resources list of api resources
 * @returns {object} slices resources slice
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function createResourcesSlices(resources) {
  const slices = {};

  // slices
  resources.forEach(resource => {
    slices[resource] = createSliceFor(resource);
  });

  return slices;
}

/**
 * @function
 * @name app
 * @description App reducer for controlling application initialization state
 *
 * @param {object} state previous app state value
 * @param {object} action dispatched action object
 * @returns {object} updated app state
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function app(state = appDefaultState, action) {
  switch (action.type) {
    case INITIALIZE_APP_START:
      return Object.assign({}, state, { loading: true });
    case INITIALIZE_APP_SUCCESS:
      return Object.assign({}, state, { loading: false });
    case INITIALIZE_APP_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      });
    case SIGNIN_APP_START:
      return Object.assign({}, state, { signing: true });
    case SIGNIN_APP_SUCCESS:
      return Object.assign({}, state, {
        party: action.payload,
        signing: false,
      });
    case SIGNIN_APP_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        signing: false,
      });
    case SIGNOUT:
      return Object.assign({}, state, {
        error: null,
        party: null,
      });
    default:
      return state;
  }
}

// all resources exposed by this library
const resources = [
  'activity',
  'adjustment',
  'agency',
  'alert',
  'alertSource',
  'assessment',
  'campaign',
  'district',
  'feature',
  'incident',
  'incidentType',
  'indicator',
  'item',
  'itemCategory',
  'itemUnit',
  'message',
  'plan',
  'procedure',
  'question',
  'questionnaire',
  'region',
  'resource',
  'role',
  'focalPerson',
  'stock',
  'warehouse',
];

const slices = createResourcesSlices(resources);

const reducers = merge({}, extractReducers(resources, slices), { app });

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export const actions = extractActions(resources, slices);

export const { dispatch } = store;
