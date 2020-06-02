import merge from 'lodash/merge';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { getAuthenticatedParty } from '@codetanzania/ewea-api-client';
import {
  createSliceFor,
  getDefaultReportInitialState,
  getReportDefaultReducer,
} from './factories/slice';
import {
  extractActions,
  extractReducers,
  extractReportReducers,
} from './utils';

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
 * @description Create slices from all EWEA resources
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
  resources.forEach((resource) => {
    slices[resource] = createSliceFor(resource);
  });

  return slices;
}

/**
 * @function
 * @name createReportsSlices
 * @description Create slices from all EWEA reports
 * @param {string[]} reports List of exposed reports by the API
 * @returns {object} slices reports slice
 * @version 0.1.0
 * @since 0.20.0
 */
export function createReportsSlices(reports) {
  const slices = {};

  reports.forEach((report) => {
    const key = `${report}Report`;
    slices[key] = createSliceFor(
      key,
      getDefaultReportInitialState(),
      getReportDefaultReducer(report)
    );
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
      return { ...state, loading: true };
    case INITIALIZE_APP_SUCCESS:
      return { ...state, loading: false };
    case INITIALIZE_APP_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SIGNIN_APP_START:
      return { ...state, signing: true };
    case SIGNIN_APP_SUCCESS:
      return { ...state, party: action.payload, signing: false };
    case SIGNIN_APP_FAILURE:
      return { ...state, error: action.payload, signing: false };
    case SIGNOUT:
      return { ...state, error: null, party: null };
    default:
      return state;
  }
}

// all resources exposed by this library
export const resources = [
  'administrativeArea',
  'administrativeLevel',
  'agency',
  'campaign',
  'changelog',
  'dispatch',
  'event',
  'eventAction',
  'eventActionCatalogue',
  'eventFunction',
  'eventGroup',
  'eventIndicator',
  'eventLevel',
  'eventSeverity',
  'eventCertainty',
  'eventStatus',
  'eventUrgency',
  'eventResponse',
  'eventQuestion',
  'eventTopic',
  'eventType',
  'feature',
  'featureType',
  'focalPerson',
  'notificationTemplate',
  'partyGender',
  'partyGroup',
  'partyOwnership',
  'partyRole',
  'partyOccupation',
  'permission',
  'unit',
  'vehicle',
  'vehicleModel',
  'vehicleMake',
  'vehicleStatus',
  'vehicleType',
  'case',
];

// Exposed reports by the API
export const REPORTS = [
  'action',
  'alert',
  'case',
  'dispatch',
  'effect',
  'event',
  'indicator',
  'need',
  'overview',
  'party',
  'resource',
  'risk',
];

const slices = createResourcesSlices(resources);

const reportSlices = createReportsSlices(REPORTS);

const reducers = merge(
  {},
  extractReducers(resources, slices),
  extractReportReducers(REPORTS, reportSlices),
  { app }
);

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export const actions = {
  ...extractActions(resources, slices),
  ...extractActions(REPORTS, reportSlices, true),
};

export const { dispatch } = store;
