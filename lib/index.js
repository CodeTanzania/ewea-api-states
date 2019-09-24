'use strict';

const forIn = require('lodash/forIn');
const get = require('lodash/get');
const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');
const PropTypes = require('prop-types');
const React = require('react');
const reactRedux = require('react-redux');
const merge = require('lodash/merge');
const redux = require('redux');
const reduxStarterKit = require('redux-starter-kit');
const eweaApiClient = require('@codetanzania/ewea-api-client');
const inflection = require('inflection');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');
const cloneDeep = require('lodash/cloneDeep');
const isEmpty = require('lodash/isEmpty');
const lowerFirst = require('lodash/lowerFirst');
const pick = require('lodash/pick');
const lodash = require('lodash');

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

function camelize(...words) {
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

function wrapActionsWithDispatch(actions, dispatch) {
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
 *
 * @param {string[]} resources list of exposed API resources
 * @param {Array<object>} slices list of resource slices
 * @returns {object} map of all resources reducers
 *
 * @version 0.1.0
 * @since 0.1.0
 */

function extractReducers(resources, slices) {
  const reducers = {}; // reducers

  resources.forEach(resource => {
    reducers[inflection.pluralize(resource)] = slices[resource].reducer;
  });
  return reducers;
}
/**
 * @function
 * @name extractActions
 * @description Extracts all actions from all slices into into a single object
 *
 * @param {string[]} resources list of api resources
 * @param {Array<object>} slices  list of all resources slices
 * @returns {object} map of all resources actions
 *
 * @version 0.1.0
 * @since 0.1.0
 */

function extractActions(resources, slices) {
  const actions = {};
  resources.forEach(resource => {
    actions[resource] = slices[resource].actions;
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

function normalizeError(error) {
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
 * @name getDefaultReducers
 * @description Generate defaultReducers object
 *
 * @param {string} resourceName Resource name
 * @returns {object} Resource reducers
 *
 * @version 0.2.0
 * @since 0.1.0
 */

function getDefaultReducers(resourceName) {
  const plural = upperFirst(inflection.pluralize(resourceName));
  const singular = upperFirst(inflection.singularize(resourceName));
  return {
    [camelize('select', singular)]: (state, action) => ({ ...state,
      selected: action.payload
    }),
    [camelize('filter', plural)]: (state, action) => ({ ...state,
      filter: action.payload
    }),
    [camelize('sort', plural)]: (state, action) => ({ ...state,
      sort: action.payload
    }),
    [camelize('search', plural)]: (state, action) => ({ ...state,
      q: action.payload
    }),
    [camelize('clear', plural, 'filters')]: state => ({ ...state,
      filters: null
    }),
    [camelize('clear', plural, 'sort')]: state => ({ ...state,
      sort: null
    }),
    [camelize('get', plural, 'Request')]: state => ({ ...state,
      loading: true
    }),
    [camelize('get', plural, 'Success')]: (state, action) => ({ ...state,
      list: [...action.payload.data],
      page: action.payload.page,
      total: action.payload.total,
      size: action.payload.size,
      loading: false
    }),
    [camelize('get', plural, 'Failure')]: (state, action) => ({ ...state,
      error: action.payload,
      loading: false
    }),
    [camelize('get', singular, 'Request')]: state => ({ ...state,
      loading: true
    }),
    [camelize('get', singular, 'Success')]: state => ({ ...state,
      loading: false
    }),
    [camelize('get', singular, 'Failure')]: (state, action) => ({ ...state,
      loading: false,
      error: action.payload
    }),
    [camelize('post', singular, 'Request')]: state => ({ ...state,
      posting: true
    }),
    [camelize('post', singular, 'Success')]: state => ({ ...state,
      posting: false,
      showForm: false
    }),
    [camelize('post', singular, 'Failure')]: (state, action) => ({ ...state,
      error: action.payload,
      posting: false
    }),
    [camelize('put', singular, 'Request')]: state => ({ ...state,
      posting: true
    }),
    [camelize('put', singular, 'Success')]: state => ({ ...state,
      posting: false,
      showForm: false
    }),
    [camelize('put', singular, 'Failure')]: (state, action) => ({ ...state,
      posting: false,
      error: action.payload
    }),
    [camelize('delete', singular, 'Request')]: state => ({ ...state,
      posting: true
    }),
    [camelize('delete', singular, 'Success')]: state => ({ ...state,
      posting: false
    }),
    [camelize('delete', singular, 'Failure')]: (state, action) => ({ ...state,
      posting: false,
      error: action.payload
    }),
    [camelize('open', singular, 'Form')]: state => ({ ...state,
      showForm: true
    }),
    [camelize('close', singular, 'Form')]: state => ({ ...state,
      showForm: false
    }),
    [camelize('set', singular, 'Schema')]: (state, action) => ({ ...state,
      schema: action.payload
    })
  };
}
/**
 * @function
 * @name getDefaultInitialState
 * @description Generate default initial State for resource
 *
 * @returns {object} Initial states of a resource
 *
 * @version 0.1.0
 * @since 0.1.0
 */

function getDefaultInitialState() {
  return {
    list: [],
    selected: null,
    page: 1,
    total: 0,
    pages: 1,
    size: 0,
    loading: false,
    posting: false,
    showForm: false,
    schema: null,
    filter: null,
    sort: null,
    q: undefined
  };
}
/**
 * @function
 * @name createSliceFor
 * @description Slice Factory which is used to create slice
 *
 * @param {string} sliceName Slice name which will results to be reducer name
 * @param {object} initialState Optional override of default initial state
 * @param {object} reducers Optional override of default reducers
 * @returns {object} slice resource slice
 *
 * @version 0.1.0
 * @since 0.1.0
 */

function createSliceFor(sliceName, initialState = null, reducers = null) {
  let defaultReducers = getDefaultReducers(sliceName);
  let initialDefaultState = getDefaultInitialState();

  if (initialState) {
    initialDefaultState = initialState;
  }

  if (reducers && isObject(reducers)) {
    defaultReducers = reducers;
  }

  return reduxStarterKit.createSlice({
    slice: sliceName,
    initialState: initialDefaultState,
    reducers: defaultReducers
  });
}

/* application action types */

const INITIALIZE_APP_START = 'app/initialize';
const INITIALIZE_APP_SUCCESS = 'app/initializeSuccess';
const INITIALIZE_APP_FAILURE = 'app/initializeFailure';
const SIGNIN_APP_START = 'app/signin';
const SIGNIN_APP_SUCCESS = 'app/signinSuccess';
const SIGNIN_APP_FAILURE = 'app/signinFailure';
const SIGNOUT = 'app/signout';
/* constants */

const appDefaultState = {
  loading: false,
  signing: false,
  error: null,
  party: eweaApiClient.getAuthenticatedParty()
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

function createResourcesSlices(resources) {
  const slices = {}; // slices

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

function app(state = appDefaultState, action) {
  switch (action.type) {
    case INITIALIZE_APP_START:
      return { ...state,
        loading: true
      };

    case INITIALIZE_APP_SUCCESS:
      return { ...state,
        loading: false
      };

    case INITIALIZE_APP_FAILURE:
      return { ...state,
        loading: false,
        error: action.payload
      };

    case SIGNIN_APP_START:
      return { ...state,
        signing: true
      };

    case SIGNIN_APP_SUCCESS:
      return { ...state,
        party: action.payload,
        signing: false
      };

    case SIGNIN_APP_FAILURE:
      return { ...state,
        error: action.payload,
        signing: false
      };

    case SIGNOUT:
      return { ...state,
        error: null,
        party: null
      };

    default:
      return state;
  }
} // all resources exposed by this library

const resources = ['agency', 'alert', 'alertSource', 'assessment', 'campaign', 'district', 'feature', 'focalPerson', 'incident', 'incidentType', 'indicator', 'message', 'question', 'questionnaire', 'region', 'role'];
const slices = createResourcesSlices(resources);
const reducers = merge({}, extractReducers(resources, slices), {
  app
});
const rootReducer = redux.combineReducers(reducers);
const store = reduxStarterKit.configureStore({
  reducer: rootReducer,
  devTools: true
});
const actions = extractActions(resources, slices);
const {
  dispatch
} = store;

/**
 * @function
 * @name createThunkFor
 * @description Create and expose all common thunks for a resource.
 *
 * Custom thunk implementations can be added to the specific resource
 * actions module
 *
 * @param {string} resource  resource name
 * @returns {object} thunks  resource thunks
 *
 * @version 0.3.0
 * @since 0.1.0
 */

function createThunksFor(resource) {
  const pluralName = upperFirst(inflection.pluralize(resource));
  const singularName = upperFirst(inflection.singularize(resource));
  const resourceName = lowerFirst(singularName);
  const storeKey = lowerFirst(pluralName);
  const thunks = {};
  /**
   * @function
   * @name getResources
   * @description A thunk that will be dispatched when fetching data from API
   *
   * @param {object} param  Param object to be passed to API client
   * @param {Function} onSuccess  Callback to be called when fetching
   * resources from the API succeed
   * @param {Function} onError  Callback to be called when fetching
   * resources from the API fails
   * @returns {Function}  Thunk function
   *
   * @version 0.2.0
   * @since 0.1.0
   */

  thunks[camelize('get', pluralName)] = (param, onSuccess, onError) => dispatch => {
    dispatch(actions[resourceName][camelize('get', pluralName, 'request')]());
    return eweaApiClient.httpActions[camelize('get', pluralName)](param).then(data => {
      dispatch(actions[resourceName][camelize('get', pluralName, 'success')](data)); // custom provided onSuccess callback

      if (isFunction(onSuccess)) {
        onSuccess();
      }
    }).catch(error => {
      const normalizedError = normalizeError(error);
      dispatch(actions[resourceName][camelize('get', pluralName, 'failure')](normalizedError)); // custom provided onError callback

      if (isFunction(onError)) {
        onError(error);
      }
    });
  };
  /**
   * @function
   * @name getResource
   * @description A thunk that will be dispatched when fetching
   * single resource data from the API
   *
   * @param {string} id  Resource unique identification
   * @param {Function} onSuccess  Callback to be called when getting a
   * resource from the API succeed
   * @param {Function} onError  Callback to be called when getting a resource
   * from the API fails
   * @returns {Function} Thunk function
   *
   * @version 0.2.0
   * @since 0.1.0
   */


  thunks[camelize('get', singularName)] = (id, onSuccess, onError) => dispatch => {
    dispatch(actions[resourceName][camelize('get', singularName, 'request')]());
    return eweaApiClient.httpActions[camelize('get', singularName)](id).then(data => {
      dispatch(actions[resourceName][camelize('get', singularName, 'success')](data)); // custom provided onSuccess callback

      if (isFunction(onSuccess)) {
        onSuccess();
      }
    }).catch(error => {
      const normalizedError = normalizeError(error);
      dispatch(actions[resourceName][camelize('get', singularName, 'failure')](normalizedError)); // custom provided onError callback

      if (isFunction(onError)) {
        onError(error);
      }
    });
  };
  /**
   * @function
   * @name postResource
   * @description A thunk that will be dispatched when creating a single
   * resource data in the API
   *
   * @param {object} param Resource  object to be created/Saved
   * @param {Function} onSuccess Callback to be executed when posting a
   * resource succeed
   * @param {Function} onError Callback to be executed when posting
   * resource fails
   * @returns {Function} Thunk function
   *
   * @version 0.2.0
   * @since 0.1.0
   */


  thunks[camelize('post', singularName)] = (param, onSuccess, onError) => dispatch => {
    dispatch(actions[resourceName][camelize('post', singularName, 'request')]());
    return eweaApiClient.httpActions[camelize('post', singularName)](param).then(data => {
      dispatch(actions[resourceName][camelize('post', singularName, 'success')](data));
      dispatch(actions[resourceName][camelize('clear', pluralName, 'filters')]());
      dispatch(actions[resourceName][camelize('clear', pluralName, 'sort')]());
      dispatch(actions[resourceName][camelize('search', pluralName)]());
      dispatch(thunks[camelize('get', pluralName)]()); // custom provided onSuccess callback

      if (isFunction(onSuccess)) {
        onSuccess();
      }
    }).catch(error => {
      const normalizedError = normalizeError(error);
      dispatch(actions[resourceName][camelize('post', singularName, 'failure')](normalizedError)); // custom provided onError callback

      if (isFunction(onError)) {
        onError(error);
      }
    });
  };
  /**
   * @function
   * @name putResource
   * @description A thunk that will be dispatched when updating a single
   * resource data in the API
   *
   * @param {object} param Resource  object to be updated
   * @param {Function} onSuccess Callback to be executed when updating a
   * resource succeed
   * @param {Function} onError Callback to be executed when updating a
   * resource fails
   * @returns {Function} Thunk function
   *
   * @version 0.2.0
   * @since 0.1.0
   */


  thunks[camelize('put', singularName)] = (param, onSuccess, onError) => dispatch => {
    dispatch(actions[resourceName][camelize('put', singularName, 'request')]());
    return eweaApiClient.httpActions[camelize('put', singularName)](param).then(data => {
      dispatch(actions[resourceName][camelize('put', singularName, 'success')](data));
      dispatch(actions[resourceName][camelize('clear', pluralName, 'filters')]());
      dispatch(actions[resourceName][camelize('clear', pluralName, 'sort')]());
      dispatch(actions[resourceName][camelize('search', pluralName)]());
      dispatch(thunks[camelize('get', pluralName)]()); // custom provided onSuccess callback

      if (isFunction(onSuccess)) {
        onSuccess();
      }
    }).catch(error => {
      const normalizedError = normalizeError(error);
      dispatch(actions[resourceName][camelize('put', singularName, 'failure')](normalizedError)); // custom provided onError callback

      if (isFunction(onError)) {
        onError(error);
      }
    });
  };
  /**
   * @function
   * @name deleteResource
   * @description A thunk that will be dispatched when deleting/archiving
   * a single resource data in the API
   *
   * @param {string} id Resource unique identification
   * @param {Function} onSuccess Callback to be executed when updating a
   * resource succeed
   * @param {Function} onError Callback to be executed when updating a
   * resource fails
   * @returns {Function} Thunk function
   *
   * @version 0.2.0
   * @since 0.1.0
   */


  thunks[camelize('delete', singularName)] = (id, onSuccess, onError) => (dispatch, getState) => {
    dispatch(actions[resourceName][camelize('delete', singularName, 'request')]());
    return eweaApiClient.httpActions[camelize('delete', singularName)](id).then(data => {
      dispatch(actions[resourceName][camelize('delete', singularName, 'success')](data));
      const {
        page,
        filter
      } = getState()[storeKey]; // custom provided onSuccess callback

      if (isFunction(onSuccess)) {
        onSuccess();
      }

      return dispatch(thunks[camelize('get', pluralName)]({
        page,
        filter
      }));
    }).catch(error => {
      const normalizedError = normalizeError(error);
      dispatch(actions[resourceName][camelize('delete', singularName, 'failure')](normalizedError)); // custom provided onError callback

      if (isFunction(onError)) {
        onError(error);
      }
    });
  };
  /**
   * @function
   * @name fetchResources
   * @description A thunk that for fetching data from the API the difference
   * between this and get thunk is this will apply all the criteria on fetch.
   * Pagination, filters, Search Query and sort.
   *
   * @param {Function} onSuccess Callback to be called when fetching
   * resources from the API succeed
   * @param {Function} onError Callback to be called when fetching
   * resources from the API fails
   * @returns {Function} Thunk function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('fetch', pluralName)] = (onSuccess, onError) => (dispatch, getState) => {
    const {
      page,
      sort,
      filter,
      q
    } = getState()[storeKey];
    return dispatch(thunks[camelize('get', pluralName)]({
      page,
      filter,
      sort,
      q
    }, onSuccess, onError));
  };
  /**
   * @function
   * @name filterResources
   * @description A thunk that will be dispatched when filtering resources
   *  data in the API
   *
   * @param {object} filter Resource filter criteria object
   * @param {Function} onSuccess Callback to be executed when filtering
   * resources succeed
   * @param {Function} onError Callback to be executed when filtering
   * resources fails
   * @returns {Function} Thunk function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('filter', pluralName)] = (filter, onSuccess, onError) => dispatch => {
    dispatch(actions[resourceName][camelize('filter', pluralName)](filter));
    return dispatch(thunks[camelize('get', pluralName)]({
      filter
    }, onSuccess, onError));
  };
  /**
   * @function
   * @name refreshResources
   * @description A thunk that will be dispatched when refreshing resources
   *  data in the API
   *
   * @param {Function} onSuccess Callback to be executed when refreshing
   * resources succeed
   * @param {Function} onError Callback to be executed when refreshing
   * resources fails
   * @returns {Function} Thunk function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('refresh', pluralName)] = (onSuccess, onError) => (dispatch, getState) => {
    const {
      page,
      filter,
      q
    } = getState()[storeKey];
    return dispatch(thunks[camelize('get', pluralName)]({
      page,
      filter,
      q
    }, onSuccess, onError));
  };
  /**
   * @function
   * @name searchResources
   * @description A thunk that will be dispatched when searching resources
   *  data in the API
   *
   * @param {string} query  Search query string
   * @param {Function} onSuccess Callback to be executed when searching
   * resources succeed
   * @param {Function} onError Callback to be executed when searching
   * resources fails
   * @returns {Function} Thunk function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('search', pluralName)] = (query, onSuccess, onError) => (dispatch, getState) => {
    dispatch(actions[resourceName][camelize('search', pluralName)](query));
    const {
      filter
    } = getState()[storeKey];
    return dispatch(thunks[camelize('get', pluralName)]({
      q: query,
      filter
    }, onSuccess, onError));
  };
  /**
   * @function
   * @name sortResources
   * @description A thunk that will be dispatched when sorting resources
   *  data in the API
   *
   * @param {object} order sort order object
   * @param {Function} onSuccess Callback to be executed when sorting
   * resources succeed
   * @param {Function} onError Callback to be executed when sorting
   * resources fails
   * @returns {Function} Thunk function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('sort', pluralName)] = (order, onSuccess, onError) => (dispatch, getState) => {
    const {
      page
    } = getState()[storeKey];
    dispatch(actions[resourceName][camelize('sort', pluralName)](order));
    return dispatch(thunks[camelize('get', pluralName)]({
      page,
      sort: order
    }, onSuccess, onError));
  };
  /**
   * @function
   * @name paginateResources
   * @description A thunk that will be dispatched when paginating resources
   *  data in the API
   *
   * @param {number} page  paginate to page
   * @param {Function} onSuccess Callback to be executed when paginating
   * resources succeed
   * @param {Function} onError Callback to be executed when paginating
   * resources fails
   * @returns {Function} Thunk function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('paginate', pluralName)] = (page, onSuccess, onError) => (dispatch, getState) => {
    const {
      filter,
      q
    } = getState()[storeKey];
    return dispatch(thunks[camelize('get', pluralName)]({
      page,
      filter,
      q
    }, onSuccess, onError));
  };
  /**
   * @function
   * @name clearReourceFilters
   * @description A thunk that will be dispatched when clearing filters on
   * resources data in the API
   *
   * @param {Function} onSuccess Callback to be executed when filters are
   *  cleared and resources data is reloaded successfully
   * @param {Function} onError Callback to be executed when filters are
   * cleared and resources data fails to reload
   * @param {string[]} keep list of filter names to be kept
   * @returns {Function} Thunk Function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('clear', singularName, 'filters')] = (onSuccess, onError, keep = []) => (dispatch, getState) => {
    if (!isEmpty(keep)) {
      // keep specified filters
      let keptFilters = pick(getState()[storeKey].filter, keep);
      keptFilters = isEmpty(keptFilters) ? null : keptFilters;
      return dispatch(thunks[camelize('filter', pluralName)](keptFilters, onSuccess, onError));
    } // clear all filters


    return dispatch(thunks[camelize('filter', pluralName)](null, onSuccess, onError));
  };
  /**
   * @function
   * @name clearResourcesSort
   * @description A thunk that will be dispatched when clearing sort order on
   * resources data in the API
   *
   * @param {Function} onSuccess Callback to be executed when sort are
   *  cleared and resources data is reloaded successfully
   * @param {Function} onError Callback to be executed when sort are
   * cleared and resources data fails to reload
   * @returns {Function} Thunk function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('clear', pluralName, 'sort')] = (onSuccess, onError) => (dispatch, getState) => {
    const {
      page
    } = getState()[storeKey];
    dispatch(actions[resourceName][camelize('clear', pluralName, 'sort')]());
    return dispatch(thunks[camelize('get', pluralName)]({
      page
    }, onSuccess, onError));
  };

  return thunks;
}

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

function generateExposedActions(resource, actions, dispatch, thunks = null) {
  const resourceName = inflection.singularize(upperFirst(resource));
  const generatedThunks = createThunksFor(resourceName);
  merge(generatedThunks, thunks);
  const extractedActions = {};
  extractedActions[camelize('select', resourceName)] = get(actions[resource], camelize('select', resourceName));
  extractedActions[camelize('open', resourceName, 'form')] = get(actions[resource], camelize('open', resourceName, 'form'));
  extractedActions[camelize('close', resourceName, 'form')] = get(actions[resource], camelize('close', resourceName, 'form'));
  extractedActions[camelize('set', resourceName, 'schema')] = get(actions[resource], camelize('set', resourceName, 'schema'));
  const allActions = merge({}, extractedActions, generatedThunks);
  return wrapActionsWithDispatch(allActions, dispatch);
}

const stakeholderActions = generateExposedActions('agency', actions, dispatch);
const {
  clearAgencyFilters,
  clearAgenciesSort,
  closeAgencyForm,
  deleteAgency,
  filterAgencies,
  getAgencies,
  getAgency,
  selectAgency,
  openAgencyForm,
  paginateAgencies,
  postAgency,
  putAgency,
  refreshAgencies,
  searchAgencies,
  setAgencySchema,
  sortAgencies
} = stakeholderActions;

const alertActions = generateExposedActions('alert', actions, dispatch);
const {
  clearAlertFilters,
  clearAlertsSort,
  closeAlertForm,
  deleteAlert,
  filterAlerts,
  getAlerts,
  getAlert,
  selectAlert,
  openAlertForm,
  paginateAlerts,
  postAlert,
  putAlert,
  refreshAlerts,
  searchAlerts,
  setAlertSchema,
  sortAlerts
} = alertActions;

const alertActions$1 = generateExposedActions('alertSource', actions, dispatch);
const {
  clearAlertSourceFilters,
  clearAlertSourcesSort,
  closeAlertSourceForm,
  deleteAlertSource,
  filterAlertSources,
  getAlertSources,
  getAlertSource,
  selectAlertSource,
  openAlertSourceForm,
  paginateAlertSources,
  postAlertSource,
  putAlertSource,
  refreshAlertSources,
  searchAlertSources,
  setAlertSourceSchema,
  sortAlertSources
} = alertActions$1;

/* declarations */

const {
  getSchemas
} = eweaApiClient.httpActions;
/**
 * Action dispatched when application initialization starts
 *
 * @function
 * @name initializeAppStart
 *
 * @returns {object} - Action object
 *
 * @version 0.1.0
 * @since 0.1.0
 */

function initializeAppStart() {
  return {
    type: INITIALIZE_APP_START
  };
}
/**
 * Action dispatched when application initialization is successfully
 *
 * @function
 * @name initializeAppSuccess
 *
 *
 * @returns {object} - action Object
 *
 * @version 0.1.0
 * @since 0.1.0
 */

function initializeAppSuccess() {
  return {
    type: INITIALIZE_APP_SUCCESS
  };
}
/**
 * Action dispatched when an error occurs during application initialization
 *
 * @function
 * @name initializeAppFailure
 *
 * @param {object} error - error happened during application initialization
 *
 * @returns {object} - Nothing is returned
 *
 * @version 0.1.0
 * @since 0.1.0
 */

function initializeAppFailure(error) {
  return {
    type: INITIALIZE_APP_FAILURE,
    payload: error
  };
}
/**
 * Action dispatched when user start to signing into the system
 *
 * @function
 * @name signinStart
 *
 * @returns {object} - redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */

function signinStart() {
  return {
    type: SIGNIN_APP_START
  };
}
/**
 * Action dispatched when user successfully signined into the system
 *
 * @function
 * @name signinSuccess
 *
 * @param {object} party - signined user/party
 * @returns {object} - redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */

function signinSuccess(party) {
  return {
    type: SIGNIN_APP_SUCCESS,
    payload: party
  };
}
/**
 * Action dispatched when user signining fails
 *
 * @param {object} error - Error instance
 * @returns {object} - redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */

function signinFailure(error) {
  return {
    type: SIGNIN_APP_FAILURE,
    payload: error
  };
}
/**
 * Action dispatched when user signout
 *
 * @function
 * @name signout
 *
 * @returns {object} - Redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */

function signout() {
  return {
    type: SIGNOUT
  };
}
/**
 * Action dispatched when application is started. It will load up all schema
 * need for in the application
 *
 * @function
 * @name initializeApp
 *
 * @returns {Function} - thunk function
 *
 * @version 0.1.0
 * @since 0.1.0
 */

function initializeApp() {
  return dispatch => {
    dispatch(initializeAppStart());
    return getSchemas().then(schemas => {
      const {
        agency: {
          setAgencySchema
        },
        alert: {
          setAlertSchema
        },
        district: {
          setDistrictSchema
        },
        feature: {
          setFeatureSchema
        },
        focalPerson: {
          setFocalPersonSchema
        },
        indicator: {
          setIndicatorSchema
        },
        incidentType: {
          setIncidentTypeSchema
        },
        question: {
          setQuestionSchema
        },
        questionnaire: {
          setQuestionnaireSchema
        },
        region: {
          setRegionSchema
        },
        role: {
          setRoleSchema
        }
      } = actions;
      const {
        Agency: agencySchema,
        Alert: alertSchema,
        District: districtSchema,
        Feature: featureSchema,
        FocalPerson: focalPersonSchema,
        IncidentType: incidentTypeSchema,
        Indicator: indicatorSchema,
        Question: questionSchema,
        Questionnaire: questionnaireSchema,
        Region: regionSchema,
        Role: roleSchema
      } = schemas;
      dispatch(setAgencySchema(agencySchema));
      dispatch(setAlertSchema(alertSchema));
      dispatch(setDistrictSchema(districtSchema));
      dispatch(setFeatureSchema(featureSchema));
      dispatch(setFocalPersonSchema(focalPersonSchema));
      dispatch(setIndicatorSchema(indicatorSchema));
      dispatch(setIncidentTypeSchema(incidentTypeSchema));
      dispatch(setQuestionSchema(questionSchema));
      dispatch(setQuestionnaireSchema(questionnaireSchema));
      dispatch(setRegionSchema(regionSchema));
      dispatch(setRoleSchema(roleSchema));
      dispatch(initializeAppSuccess());
    }).catch(error => {
      dispatch(initializeAppFailure(error));
    });
  };
}
/**
 * Thunk action to signin user/party
 *
 * @function
 * @name signin
 *
 * @param {object} credentials - Email and password
 * @param {Function} onSuccess - Callback for successfully signin
 * @param {Function} onError - Callback for failed signin
 * @returns {Promise} redux thunk
 *
 * @version 0.1.0
 * @since 0.10.3
 */

function signin(credentials, onSuccess, onError) {
  return dispatch => {
    dispatch(signinStart());
    return eweaApiClient.signin(credentials).then(results => {
      const {
        party
      } = results;
      dispatch(signinSuccess(party));

      if (lodash.isFunction(onSuccess)) {
        onSuccess();
      }
    }).catch(error => {
      dispatch(signinFailure(error));

      if (lodash.isFunction(onError)) {
        onError(error);
      }
    });
  };
}
/**
 * Wrapped initialize app thunk
 *
 * @function
 * @name wrappedInitializeApp
 * @returns {Promise} - dispatched initialize app thunk
 *
 * @version 0.1.0
 * @since 0.3.2
 */

function wrappedInitializeApp() {
  return dispatch(initializeApp());
}
/**
 * Wrapped signing thunk
 *
 * @function
 * @name wrappedSingin
 *
 * @param {object} credentials - email and password provided by user
 * @param {Function} onSuccess - Callback for successfully signin
 * @param {Function} onError - Callback for failed signin
 * @returns {Promise} - dispatched signing thunk
 *
 * @version 0.1.0
 * @since 0.10.3
 */

function wrappedSingin(credentials, onSuccess, onError) {
  return dispatch(signin(credentials, onSuccess, onError));
}
/**
 * Wrapped singout action
 *
 * @function
 * @name wrappedSignout
 *
 * @returns {undefined}
 *
 * @version 0.2.0
 * @since 0.10.3
 */

function wrappedSingout() {
  eweaApiClient.signout(); // clear sessionStorage

  return dispatch(signout());
}

const assessmentActions = generateExposedActions('assessment', actions, dispatch);
const {
  clearAssessmentFilters,
  clearAssessmentsSort,
  closeAssessmentForm,
  deleteAssessment,
  filterAssessments,
  getAssessments,
  getAssessment,
  selectAssessment,
  openAssessmentForm,
  paginateAssessments,
  postAssessment,
  putAssessment,
  refreshAssessments,
  searchAssessments,
  setAssessmentSchema,
  sortAssessments
} = assessmentActions;

const campaignActions = generateExposedActions('campaign', actions, dispatch);
const {
  clearCampaignFilters,
  clearCampaignsSort,
  closeCampaignForm,
  deleteCampaign,
  filterCampaigns,
  getCampaigns,
  getCampaign,
  selectCampaign,
  openCampaignForm,
  paginateCampaigns,
  postCampaign,
  putCampaign,
  refreshCampaigns,
  searchCampaigns,
  setCampaignSchema,
  sortCampaigns
} = campaignActions;

const featureActions = generateExposedActions('district', actions, dispatch);
const {
  clearDistrictFilters,
  clearDistrictsSort,
  closeDistrictForm,
  deleteDistrict,
  filterDistricts,
  getDistricts,
  getDistrict,
  selectDistrict,
  openDistrictForm,
  paginateDistricts,
  postDistrict,
  putDistrict,
  refreshDistricts,
  searchDistricts,
  setDistrictSchema,
  sortDistricts
} = featureActions;

const featureActions$1 = generateExposedActions('feature', actions, dispatch);
const {
  clearFeatureFilters,
  clearFeaturesSort,
  closeFeatureForm,
  deleteFeature,
  filterFeatures,
  getFeatures,
  getFeature,
  selectFeature,
  openFeatureForm,
  paginateFeatures,
  postFeature,
  putFeature,
  refreshFeatures,
  searchFeatures,
  setFeatureSchema,
  sortFeatures
} = featureActions$1;

const stakeholderActions$1 = generateExposedActions('focalPerson', actions, dispatch);
const {
  clearFocalPersonFilters,
  clearFocalPeopleSort,
  closeFocalPersonForm,
  deleteFocalPerson,
  filterFocalPeople,
  getFocalPeople,
  getFocalPerson,
  selectFocalPerson,
  openFocalPersonForm,
  paginateFocalPeople,
  postFocalPerson,
  putFocalPerson,
  refreshFocalPeople,
  searchFocalPeople,
  setFocalPersonSchema,
  sortFocalPeople
} = stakeholderActions$1;

const incidentActions = generateExposedActions('incident', actions, dispatch);
const {
  clearIncidentFilters,
  clearIncidentsSort,
  closeIncidentForm,
  deleteIncident,
  filterIncidents,
  getIncidents,
  getIncident,
  selectIncident,
  openIncidentForm,
  paginateIncidents,
  postIncident,
  putIncident,
  refreshIncidents,
  searchIncidents,
  setIncidentSchema,
  sortIncidents
} = incidentActions;

const incidentTypeActions = generateExposedActions('incidentType', actions, dispatch);
const {
  clearIncidentTypeFilters,
  clearIncidentTypesSort,
  closeIncidentTypeForm,
  deleteIncidentType,
  filterIncidentTypes,
  getIncidentTypes,
  getIncidentType,
  selectIncidentType,
  openIncidentTypeForm,
  paginateIncidentTypes,
  postIncidentType,
  putIncidentType,
  refreshIncidentTypes,
  searchIncidentTypes,
  setIncidentTypeSchema,
  sortIncidentTypes
} = incidentTypeActions;

const indicatorActions = generateExposedActions('indicator', actions, dispatch);
const {
  clearIndicatorFilters,
  clearIndicatorsSort,
  closeIndicatorForm,
  deleteIndicator,
  filterIndicators,
  getIndicators,
  getIndicator,
  selectIndicator,
  openIndicatorForm,
  paginateIndicators,
  postIndicator,
  putIndicator,
  refreshIndicators,
  searchIndicators,
  setIndicatorSchema,
  sortIndicators
} = indicatorActions;

const messageActions = generateExposedActions('message', actions, dispatch);
const {
  clearMessageFilters,
  clearMessagesSort,
  closeMessageForm,
  deleteMessage,
  filterMessages,
  getMessages,
  getMessage,
  selectMessage,
  openMessageForm,
  paginateMessages,
  postMessage,
  putMessage,
  refreshMessages,
  searchMessages,
  setMessageSchema,
  sortMessages
} = messageActions;

const questionActions = generateExposedActions('question', actions, dispatch);
const {
  clearQuestionFilters,
  clearQuestionsSort,
  closeQuestionForm,
  deleteQuestion,
  filterQuestions,
  getQuestions,
  getQuestion,
  selectQuestion,
  openQuestionForm,
  paginateQuestions,
  postQuestion,
  putQuestion,
  refreshQuestions,
  searchQuestions,
  setQuestionSchema,
  sortQuestions
} = questionActions;

const questionnaireActions = generateExposedActions('questionnaire', actions, dispatch);
const {
  clearQuestionnaireFilters,
  clearQuestionnairesSort,
  closeQuestionnaireForm,
  deleteQuestionnaire,
  filterQuestionnaires,
  getQuestionnaires,
  getQuestionnaire,
  selectQuestionnaire,
  openQuestionnaireForm,
  paginateQuestionnaires,
  postQuestionnaire,
  putQuestionnaire,
  refreshQuestionnaires,
  searchQuestionnaires,
  setQuestionnaireSchema,
  sortQuestionnaires
} = questionnaireActions;

const featureActions$2 = generateExposedActions('region', actions, dispatch);
const {
  clearRegionFilters,
  clearRegionsSort,
  closeRegionForm,
  deleteRegion,
  filterRegions,
  getRegions,
  getRegion,
  selectRegion,
  openRegionForm,
  paginateRegions,
  postRegion,
  putRegion,
  refreshRegions,
  searchRegions,
  setRegionSchema,
  sortRegions
} = featureActions$2;

const roleActions = generateExposedActions('role', actions, dispatch);
const {
  clearRoleFilters,
  clearRolesSort,
  closeRoleForm,
  deleteRole,
  filterRoles,
  getRoles,
  getRole,
  selectRole,
  openRoleForm,
  paginateRoles,
  postRole,
  putRole,
  refreshRoles,
  searchRoles,
  setRoleSchema,
  sortRoles
} = roleActions;

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

function StoreProvider({
  children
}) {
  return React.createElement(reactRedux.Provider, {
    store: store
  }, children);
}
StoreProvider.propTypes = {
  children: PropTypes.node.isRequired
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

function Connect(component, stateToProps = null) {
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

  return reactRedux.connect(mapStateToProps)(component);
}

exports.Connect = Connect;
exports.StoreProvider = StoreProvider;
exports.clearAgenciesSort = clearAgenciesSort;
exports.clearAgencyFilters = clearAgencyFilters;
exports.clearAlertFilters = clearAlertFilters;
exports.clearAlertSourceFilters = clearAlertSourceFilters;
exports.clearAlertSourcesSort = clearAlertSourcesSort;
exports.clearAlertsSort = clearAlertsSort;
exports.clearAssessmentFilters = clearAssessmentFilters;
exports.clearAssessmentsSort = clearAssessmentsSort;
exports.clearCampaignFilters = clearCampaignFilters;
exports.clearCampaignsSort = clearCampaignsSort;
exports.clearDistrictFilters = clearDistrictFilters;
exports.clearDistrictsSort = clearDistrictsSort;
exports.clearFeatureFilters = clearFeatureFilters;
exports.clearFeaturesSort = clearFeaturesSort;
exports.clearFocalPeopleSort = clearFocalPeopleSort;
exports.clearFocalPersonFilters = clearFocalPersonFilters;
exports.clearIncidentFilters = clearIncidentFilters;
exports.clearIncidentTypeFilters = clearIncidentTypeFilters;
exports.clearIncidentTypesSort = clearIncidentTypesSort;
exports.clearIncidentsSort = clearIncidentsSort;
exports.clearIndicatorFilters = clearIndicatorFilters;
exports.clearIndicatorsSort = clearIndicatorsSort;
exports.clearMessageFilters = clearMessageFilters;
exports.clearMessagesSort = clearMessagesSort;
exports.clearQuestionFilters = clearQuestionFilters;
exports.clearQuestionnaireFilters = clearQuestionnaireFilters;
exports.clearQuestionnairesSort = clearQuestionnairesSort;
exports.clearQuestionsSort = clearQuestionsSort;
exports.clearRegionFilters = clearRegionFilters;
exports.clearRegionsSort = clearRegionsSort;
exports.clearRoleFilters = clearRoleFilters;
exports.clearRolesSort = clearRolesSort;
exports.closeAgencyForm = closeAgencyForm;
exports.closeAlertForm = closeAlertForm;
exports.closeAlertSourceForm = closeAlertSourceForm;
exports.closeAssessmentForm = closeAssessmentForm;
exports.closeCampaignForm = closeCampaignForm;
exports.closeDistrictForm = closeDistrictForm;
exports.closeFeatureForm = closeFeatureForm;
exports.closeFocalPersonForm = closeFocalPersonForm;
exports.closeIncidentForm = closeIncidentForm;
exports.closeIncidentTypeForm = closeIncidentTypeForm;
exports.closeIndicatorForm = closeIndicatorForm;
exports.closeMessageForm = closeMessageForm;
exports.closeQuestionForm = closeQuestionForm;
exports.closeQuestionnaireForm = closeQuestionnaireForm;
exports.closeRegionForm = closeRegionForm;
exports.closeRoleForm = closeRoleForm;
exports.deleteAgency = deleteAgency;
exports.deleteAlert = deleteAlert;
exports.deleteAlertSource = deleteAlertSource;
exports.deleteAssessment = deleteAssessment;
exports.deleteCampaign = deleteCampaign;
exports.deleteDistrict = deleteDistrict;
exports.deleteFeature = deleteFeature;
exports.deleteFocalPerson = deleteFocalPerson;
exports.deleteIncident = deleteIncident;
exports.deleteIncidentType = deleteIncidentType;
exports.deleteIndicator = deleteIndicator;
exports.deleteMessage = deleteMessage;
exports.deleteQuestion = deleteQuestion;
exports.deleteQuestionnaire = deleteQuestionnaire;
exports.deleteRegion = deleteRegion;
exports.deleteRole = deleteRole;
exports.filterAgencies = filterAgencies;
exports.filterAlertSources = filterAlertSources;
exports.filterAlerts = filterAlerts;
exports.filterAssessments = filterAssessments;
exports.filterCampaigns = filterCampaigns;
exports.filterDistricts = filterDistricts;
exports.filterFeatures = filterFeatures;
exports.filterFocalPeople = filterFocalPeople;
exports.filterIncidentTypes = filterIncidentTypes;
exports.filterIncidents = filterIncidents;
exports.filterIndicators = filterIndicators;
exports.filterMessages = filterMessages;
exports.filterQuestionnaires = filterQuestionnaires;
exports.filterQuestions = filterQuestions;
exports.filterRegions = filterRegions;
exports.filterRoles = filterRoles;
exports.getAgencies = getAgencies;
exports.getAgency = getAgency;
exports.getAlert = getAlert;
exports.getAlertSource = getAlertSource;
exports.getAlertSources = getAlertSources;
exports.getAlerts = getAlerts;
exports.getAssessment = getAssessment;
exports.getAssessments = getAssessments;
exports.getCampaign = getCampaign;
exports.getCampaigns = getCampaigns;
exports.getDistrict = getDistrict;
exports.getDistricts = getDistricts;
exports.getFeature = getFeature;
exports.getFeatures = getFeatures;
exports.getFocalPeople = getFocalPeople;
exports.getFocalPerson = getFocalPerson;
exports.getIncident = getIncident;
exports.getIncidentType = getIncidentType;
exports.getIncidentTypes = getIncidentTypes;
exports.getIncidents = getIncidents;
exports.getIndicator = getIndicator;
exports.getIndicators = getIndicators;
exports.getMessage = getMessage;
exports.getMessages = getMessages;
exports.getQuestion = getQuestion;
exports.getQuestionnaire = getQuestionnaire;
exports.getQuestionnaires = getQuestionnaires;
exports.getQuestions = getQuestions;
exports.getRegion = getRegion;
exports.getRegions = getRegions;
exports.getRole = getRole;
exports.getRoles = getRoles;
exports.initializeApp = wrappedInitializeApp;
exports.openAgencyForm = openAgencyForm;
exports.openAlertForm = openAlertForm;
exports.openAlertSourceForm = openAlertSourceForm;
exports.openAssessmentForm = openAssessmentForm;
exports.openCampaignForm = openCampaignForm;
exports.openDistrictForm = openDistrictForm;
exports.openFeatureForm = openFeatureForm;
exports.openFocalPersonForm = openFocalPersonForm;
exports.openIncidentForm = openIncidentForm;
exports.openIncidentTypeForm = openIncidentTypeForm;
exports.openIndicatorForm = openIndicatorForm;
exports.openMessageForm = openMessageForm;
exports.openQuestionForm = openQuestionForm;
exports.openQuestionnaireForm = openQuestionnaireForm;
exports.openRegionForm = openRegionForm;
exports.openRoleForm = openRoleForm;
exports.paginateAgencies = paginateAgencies;
exports.paginateAlertSources = paginateAlertSources;
exports.paginateAlerts = paginateAlerts;
exports.paginateAssessments = paginateAssessments;
exports.paginateCampaigns = paginateCampaigns;
exports.paginateDistricts = paginateDistricts;
exports.paginateFeatures = paginateFeatures;
exports.paginateFocalPeople = paginateFocalPeople;
exports.paginateIncidentTypes = paginateIncidentTypes;
exports.paginateIncidents = paginateIncidents;
exports.paginateIndicators = paginateIndicators;
exports.paginateMessages = paginateMessages;
exports.paginateQuestionnaires = paginateQuestionnaires;
exports.paginateQuestions = paginateQuestions;
exports.paginateRegions = paginateRegions;
exports.paginateRoles = paginateRoles;
exports.postAgency = postAgency;
exports.postAlert = postAlert;
exports.postAlertSource = postAlertSource;
exports.postAssessment = postAssessment;
exports.postCampaign = postCampaign;
exports.postDistrict = postDistrict;
exports.postFeature = postFeature;
exports.postFocalPerson = postFocalPerson;
exports.postIncident = postIncident;
exports.postIncidentType = postIncidentType;
exports.postIndicator = postIndicator;
exports.postMessage = postMessage;
exports.postQuestion = postQuestion;
exports.postQuestionnaire = postQuestionnaire;
exports.postRegion = postRegion;
exports.postRole = postRole;
exports.putAgency = putAgency;
exports.putAlert = putAlert;
exports.putAlertSource = putAlertSource;
exports.putAssessment = putAssessment;
exports.putCampaign = putCampaign;
exports.putDistrict = putDistrict;
exports.putFeature = putFeature;
exports.putFocalPerson = putFocalPerson;
exports.putIncident = putIncident;
exports.putIncidentType = putIncidentType;
exports.putIndicator = putIndicator;
exports.putMessage = putMessage;
exports.putQuestion = putQuestion;
exports.putQuestionnaire = putQuestionnaire;
exports.putRegion = putRegion;
exports.putRole = putRole;
exports.refreshAgencies = refreshAgencies;
exports.refreshAlertSources = refreshAlertSources;
exports.refreshAlerts = refreshAlerts;
exports.refreshAssessments = refreshAssessments;
exports.refreshCampaigns = refreshCampaigns;
exports.refreshDistricts = refreshDistricts;
exports.refreshFeatures = refreshFeatures;
exports.refreshFocalPeople = refreshFocalPeople;
exports.refreshIncidentTypes = refreshIncidentTypes;
exports.refreshIncidents = refreshIncidents;
exports.refreshIndicators = refreshIndicators;
exports.refreshMessages = refreshMessages;
exports.refreshQuestionnaires = refreshQuestionnaires;
exports.refreshQuestions = refreshQuestions;
exports.refreshRegions = refreshRegions;
exports.refreshRoles = refreshRoles;
exports.searchAgencies = searchAgencies;
exports.searchAlertSources = searchAlertSources;
exports.searchAlerts = searchAlerts;
exports.searchAssessments = searchAssessments;
exports.searchCampaigns = searchCampaigns;
exports.searchDistricts = searchDistricts;
exports.searchFeatures = searchFeatures;
exports.searchFocalPeople = searchFocalPeople;
exports.searchIncidentTypes = searchIncidentTypes;
exports.searchIncidents = searchIncidents;
exports.searchIndicators = searchIndicators;
exports.searchMessages = searchMessages;
exports.searchQuestionnaires = searchQuestionnaires;
exports.searchQuestions = searchQuestions;
exports.searchRegions = searchRegions;
exports.searchRoles = searchRoles;
exports.selectAgency = selectAgency;
exports.selectAlert = selectAlert;
exports.selectAlertSource = selectAlertSource;
exports.selectAssessment = selectAssessment;
exports.selectCampaign = selectCampaign;
exports.selectDistrict = selectDistrict;
exports.selectFeature = selectFeature;
exports.selectFocalPerson = selectFocalPerson;
exports.selectIncident = selectIncident;
exports.selectIncidentType = selectIncidentType;
exports.selectIndicator = selectIndicator;
exports.selectMessage = selectMessage;
exports.selectQuestion = selectQuestion;
exports.selectQuestionnaire = selectQuestionnaire;
exports.selectRegion = selectRegion;
exports.selectRole = selectRole;
exports.setAgencySchema = setAgencySchema;
exports.setAlertSchema = setAlertSchema;
exports.setAlertSourceSchema = setAlertSourceSchema;
exports.setAssessmentSchema = setAssessmentSchema;
exports.setCampaignSchema = setCampaignSchema;
exports.setDistrictSchema = setDistrictSchema;
exports.setFeatureSchema = setFeatureSchema;
exports.setFocalPersonSchema = setFocalPersonSchema;
exports.setIncidentSchema = setIncidentSchema;
exports.setIncidentTypeSchema = setIncidentTypeSchema;
exports.setIndicatorSchema = setIndicatorSchema;
exports.setMessageSchema = setMessageSchema;
exports.setQuestionSchema = setQuestionSchema;
exports.setQuestionnaireSchema = setQuestionnaireSchema;
exports.setRegionSchema = setRegionSchema;
exports.setRoleSchema = setRoleSchema;
exports.signin = wrappedSingin;
exports.signout = wrappedSingout;
exports.sortAgencies = sortAgencies;
exports.sortAlertSources = sortAlertSources;
exports.sortAlerts = sortAlerts;
exports.sortAssessments = sortAssessments;
exports.sortCampaigns = sortCampaigns;
exports.sortDistricts = sortDistricts;
exports.sortFeatures = sortFeatures;
exports.sortFocalPeople = sortFocalPeople;
exports.sortIncidentTypes = sortIncidentTypes;
exports.sortIncidents = sortIncidents;
exports.sortIndicators = sortIndicators;
exports.sortMessages = sortMessages;
exports.sortQuestionnaires = sortQuestionnaires;
exports.sortQuestions = sortQuestions;
exports.sortRegions = sortRegions;
exports.sortRoles = sortRoles;
