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
const toolkit = require('@reduxjs/toolkit');
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
      hasMore: action.payload.hasMore,
      loading: false
    }),
    [camelize('get', plural, 'Failure')]: (state, action) => ({ ...state,
      error: action.payload,
      loading: false
    }),
    [camelize('load', 'more', plural, 'Request')]: state => ({ ...state,
      loading: true
    }),
    [camelize('load', 'more', plural, 'Success')]: (state, action) => ({ ...state,
      list: [...state.list, ...action.payload.data],
      page: action.payload.page,
      total: action.payload.total,
      size: action.payload.size,
      hasMore: action.payload.hasMore,
      loading: false
    }),
    [camelize('load', 'more', plural, 'Failure')]: (state, action) => ({ ...state,
      error: action.payload,
      loading: false
    }),
    [camelize('get', singular, 'Request')]: state => ({ ...state,
      loading: true
    }),
    [camelize('get', singular, 'Success')]: (state, action) => ({ ...state,
      selected: action.payload,
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
    [camelize('put', singular, 'Success')]: (state, action) => ({ ...state,
      selected: action.payload,
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
    q: undefined,
    hasMore: false
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

  return toolkit.createSlice({
    name: sliceName,
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

const resources = ['administrativeArea', 'agency', 'changelog', 'event', 'eventAction', 'eventCertainty', 'eventFunction', 'eventGroup', 'eventIndicator', 'eventQuestion', 'eventSeverity', 'eventType', 'feature', 'focalPerson', 'notificationTemplate', 'partyRole'];
const slices = createResourcesSlices(resources);
const reducers = merge({}, extractReducers(resources, slices), {
  app
});
const rootReducer = redux.combineReducers(reducers);
const store = toolkit.configureStore({
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
   * @param {object} options Additional options params i.e {filters:{}} will be
   * applied on successfully post action
   * @returns {Function} Thunk function
   *
   * @version 0.2.0
   * @since 0.1.0
   */


  thunks[camelize('post', singularName)] = (param, onSuccess, onError, options) => (dispatch, getState) => {
    dispatch(actions[resourceName][camelize('post', singularName, 'request')]());
    return eweaApiClient.httpActions[camelize('post', singularName)](param).then(data => {
      dispatch(actions[resourceName][camelize('post', singularName, 'success')](data));
      dispatch(actions[resourceName][camelize('clear', pluralName, 'filters')]());
      dispatch(actions[resourceName][camelize('clear', pluralName, 'sort')]());
      dispatch(actions[resourceName][camelize('search', pluralName)]());

      if (!isEmpty(options) && !isEmpty(options.filters)) {
        dispatch(actions[resourceName][camelize('filter', pluralName)](options.filters));
        const {
          filter
        } = getState()[storeKey];
        dispatch(thunks[camelize('get', pluralName)]({
          filter
        }));
      } else {
        dispatch(thunks[camelize('get', pluralName)]());
      } // custom provided onSuccess callback


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
   * @name loadMoreResources
   * @description A thunk that will be dispatched when loading more data without
   * paginating resource data in the API
   *
   * @param {Function} onSuccess Callback to be executed when paginating
   * resources succeed
   * @param {Function} onError Callback to be executed when paginating
   * resources fails
   * @returns {Function} Thunk function
   *
   * @version 0.1.0
   * @since 0.1.0
   */


  thunks[camelize('load', 'more', pluralName)] = (onSuccess, onError) => (dispatch, getState) => {
    dispatch(actions[resourceName][camelize('load', 'more', pluralName, 'request')]());
    const {
      page,
      filter,
      hasMore
    } = getState()[storeKey];
    const nextPage = page + 1;

    if (!hasMore) {
      return undefined;
    }

    return eweaApiClient.httpActions[camelize('get', pluralName)]({
      page: nextPage,
      filter
    }).then(data => {
      dispatch(actions[resourceName][camelize('load', 'more', pluralName, 'success')](data)); // custom provided onSuccess callback

      if (isFunction(onSuccess)) {
        onSuccess();
      }
    }).catch(error => {
      const normalizedError = normalizeError(error);
      dispatch(actions[resourceName][camelize('load', 'more', pluralName, 'failure')](normalizedError)); // custom provided onError callback

      if (isFunction(onError)) {
        onError(error);
      }
    });
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
  sortAgencies,
  loadMoreAgencies
} = stakeholderActions;

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
        // alert: { setAlertSchema },
        // district: { setDistrictSchema },
        // feature: { setFeatureSchema },
        focalPerson: {
          setFocalPersonSchema
        } // indicator: { setIndicatorSchema },
        // incidentType: { setIncidentTypeSchema },
        // question: { setQuestionSchema },
        // questionnaire: { setQuestionnaireSchema },
        // region: { setRegionSchema },
        // role: { setRoleSchema },

      } = actions;
      const {
        Agency: agencySchema,
        //   Alert: alertSchema,
        //   District: districtSchema,
        //   Feature: featureSchema,
        FocalPerson: focalPersonSchema //   IncidentType: incidentTypeSchema,
        //   Indicator: indicatorSchema,
        //   Question: questionSchema,
        //   Questionnaire: questionnaireSchema,
        //   Region: regionSchema,
        //   Role: roleSchema,

      } = schemas;
      dispatch(setAgencySchema(agencySchema)); // dispatch(setAlertSchema(alertSchema));
      // dispatch(setDistrictSchema(districtSchema));
      // dispatch(setFeatureSchema(featureSchema));

      dispatch(setFocalPersonSchema(focalPersonSchema)); // dispatch(setIndicatorSchema(indicatorSchema));
      // dispatch(setIncidentTypeSchema(incidentTypeSchema));
      // dispatch(setQuestionSchema(questionSchema));
      // dispatch(setQuestionnaireSchema(questionnaireSchema));
      // dispatch(setRegionSchema(regionSchema));
      // dispatch(setRoleSchema(roleSchema));

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

const administrativeAreaActions = generateExposedActions('administrativeArea', actions, dispatch);
const {
  clearAdministrativeAreaFilters,
  clearAdministrativeAreasSort,
  closeAdministrativeAreaForm,
  deleteAdministrativeArea,
  filterAdministrativeAreas,
  getAdministrativeAreas,
  getAdministrativeArea,
  selectAdministrativeArea,
  openAdministrativeAreaForm,
  paginateAdministrativeAreas,
  postAdministrativeArea,
  putAdministrativeArea,
  refreshAdministrativeAreas,
  searchAdministrativeAreas,
  setAdministrativeAreaSchema,
  sortAdministrativeAreas,
  loadMoreAdministrativeAreas
} = administrativeAreaActions;

const changelogActions = generateExposedActions('changelog', actions, dispatch);
const {
  clearChangelogFilters,
  clearChangelogsSort,
  closeChangelogForm,
  deleteChangelog,
  filterChangelogs,
  getChangelogs,
  getChangelog,
  selectChangelog,
  openChangelogForm,
  paginateChangelogs,
  postChangelog,
  putChangelog,
  refreshChangelogs,
  searchChangelogs,
  setChangelogSchema,
  sortChangelogs,
  loadMoreChangelogs
} = changelogActions;

const eventActions = generateExposedActions('event', actions, dispatch);
const {
  clearEventFilters,
  clearEventsSort,
  closeEventForm,
  deleteEvent,
  filterEvents,
  getEvents,
  getEvent,
  selectEvent,
  openEventForm,
  paginateEvents,
  postEvent,
  putEvent,
  refreshEvents,
  searchEvents,
  setEventSchema,
  sortEvents,
  loadMoreEvents
} = eventActions;

const eventActionActions = generateExposedActions('eventAction', actions, dispatch);
const {
  clearEventActionFilters,
  clearEventActionsSort,
  closeEventActionForm,
  deleteEventAction,
  filterEventActions,
  getEventActions,
  getEventAction,
  selectEventAction,
  openEventActionForm,
  paginateEventActions,
  postEventAction,
  putEventAction,
  refreshEventActions,
  searchEventActions,
  setEventActionSchema,
  sortEventActions,
  loadMoreEventActions
} = eventActionActions;

const eventCertaintyActions = generateExposedActions('eventCertainty', actions, dispatch);
const {
  clearEventCertaintyFilters,
  clearEventCertaintiesSort,
  closeEventCertaintyForm,
  deleteEventCertainty,
  filterEventCertainties,
  getEventCertainties,
  getEventCertainty,
  selectEventCertainty,
  openEventCertaintyForm,
  paginateEventCertainties,
  postEventCertainty,
  putEventCertainty,
  refreshEventCertainties,
  searchEventCertainties,
  setEventCertaintySchema,
  sortEventCertainties,
  loadMoreEventCertainties
} = eventCertaintyActions;

const eventFunctionActions = generateExposedActions('eventFunction', actions, dispatch);
const {
  clearEventFunctionFilters,
  clearEventFunctionsSort,
  closeEventFunctionForm,
  deleteEventFunction,
  filterEventFunctions,
  getEventFunctions,
  getEventFunction,
  selectEventFunction,
  openEventFunctionForm,
  paginateEventFunctions,
  postEventFunction,
  putEventFunction,
  refreshEventFunctions,
  searchEventFunctions,
  setEventFunctionSchema,
  sortEventFunctions,
  loadMoreEventFunctions
} = eventFunctionActions;

const eventGroupActions = generateExposedActions('eventGroup', actions, dispatch);
const {
  clearEventGroupFilters,
  clearEventGroupsSort,
  closeEventGroupForm,
  deleteEventGroup,
  filterEventGroups,
  getEventGroups,
  getEventGroup,
  selectEventGroup,
  openEventGroupForm,
  paginateEventGroups,
  postEventGroup,
  putEventGroup,
  refreshEventGroups,
  searchEventGroups,
  setEventGroupSchema,
  sortEventGroups,
  loadMoreEventGroups
} = eventGroupActions;

const eventIndicatorActions = generateExposedActions('eventIndicator', actions, dispatch);
const {
  clearEventIndicatorFilters,
  clearEventIndicatorsSort,
  closeEventIndicatorForm,
  deleteEventIndicator,
  filterEventIndicators,
  getEventIndicators,
  getEventIndicator,
  selectEventIndicator,
  openEventIndicatorForm,
  paginateEventIndicators,
  postEventIndicator,
  putEventIndicator,
  refreshEventIndicators,
  searchEventIndicators,
  setEventIndicatorSchema,
  sortEventIndicators,
  loadMoreEventIndicators
} = eventIndicatorActions;

const eventQuestionActions = generateExposedActions('eventQuestion', actions, dispatch);
const {
  clearEventQuestionFilters,
  clearEventQuestionsSort,
  closeEventQuestionForm,
  deleteEventQuestion,
  filterEventQuestions,
  getEventQuestions,
  getEventQuestion,
  selectEventQuestion,
  openEventQuestionForm,
  paginateEventQuestions,
  postEventQuestion,
  putEventQuestion,
  refreshEventQuestions,
  searchEventQuestions,
  setEventQuestionSchema,
  sortEventQuestions,
  loadMoreEventQuestions
} = eventQuestionActions;

const eventSeverityActions = generateExposedActions('eventSeverity', actions, dispatch);
const {
  clearEventSeverityFilters,
  clearEventSeveritiesSort,
  closeEventSeverityForm,
  deleteEventSeverity,
  filterEventSeverities,
  getEventSeverities,
  getEventSeverity,
  selectEventSeverity,
  openEventSeverityForm,
  paginateEventSeverities,
  postEventSeverity,
  putEventSeverity,
  refreshEventSeverities,
  searchEventSeverities,
  setEventSeveritySchema,
  sortEventSeverities,
  loadMoreEventSeverities
} = eventSeverityActions;

const eventTypeActions = generateExposedActions('eventType', actions, dispatch);
const {
  clearEventTypeFilters,
  clearEventTypesSort,
  closeEventTypeForm,
  deleteEventType,
  filterEventTypes,
  getEventTypes,
  getEventType,
  selectEventType,
  openEventTypeForm,
  paginateEventTypes,
  postEventType,
  putEventType,
  refreshEventTypes,
  searchEventTypes,
  setEventTypeSchema,
  sortEventTypes,
  loadMoreEventTypes
} = eventTypeActions;

const featureActions = generateExposedActions('feature', actions, dispatch);
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
  sortFeatures,
  loadMoreFeatures
} = featureActions;

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
  sortFocalPeople,
  loadMoreFocalPeople
} = stakeholderActions$1;

const stakeholderActions$2 = generateExposedActions('notificationTemplate', actions, dispatch);
const {
  clearNotificationTemplateFilters,
  clearNotificationTemplatesSort,
  closeNotificationTemplateForm,
  deleteNotificationTemplate,
  filterNotificationTemplates,
  getNotificationTemplates,
  getNotificationTemplate,
  selectNotificationTemplate,
  openNotificationTemplateForm,
  paginateNotificationTemplates,
  postNotificationTemplate,
  putNotificationTemplate,
  refreshNotificationTemplates,
  searchNotificationTemplates,
  setNotificationTemplateSchema,
  sortNotificationTemplates,
  loadMoreNotificationTemplates
} = stakeholderActions$2;

const partyRoleActions = generateExposedActions('partyRole', actions, dispatch);
const {
  clearPartyRoleFilters,
  clearPartyRolesSort,
  closePartyRoleForm,
  deletePartyRole,
  filterPartyRoles,
  getPartyRoles,
  getPartyRole,
  selectPartyRole,
  openPartyRoleForm,
  paginatePartyRoles,
  postPartyRole,
  putPartyRole,
  refreshPartyRoles,
  searchPartyRoles,
  setPartyRoleSchema,
  sortPartyRoles,
  loadMorePartyRoles
} = partyRoleActions;

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
exports.clearAdministrativeAreaFilters = clearAdministrativeAreaFilters;
exports.clearAdministrativeAreasSort = clearAdministrativeAreasSort;
exports.clearAgenciesSort = clearAgenciesSort;
exports.clearAgencyFilters = clearAgencyFilters;
exports.clearChangelogFilters = clearChangelogFilters;
exports.clearChangelogsSort = clearChangelogsSort;
exports.clearEventActionFilters = clearEventActionFilters;
exports.clearEventActionsSort = clearEventActionsSort;
exports.clearEventCertaintiesSort = clearEventCertaintiesSort;
exports.clearEventCertaintyFilters = clearEventCertaintyFilters;
exports.clearEventFilters = clearEventFilters;
exports.clearEventFunctionFilters = clearEventFunctionFilters;
exports.clearEventFunctionsSort = clearEventFunctionsSort;
exports.clearEventGroupFilters = clearEventGroupFilters;
exports.clearEventGroupsSort = clearEventGroupsSort;
exports.clearEventIndicatorFilters = clearEventIndicatorFilters;
exports.clearEventIndicatorsSort = clearEventIndicatorsSort;
exports.clearEventQuestionFilters = clearEventQuestionFilters;
exports.clearEventQuestionsSort = clearEventQuestionsSort;
exports.clearEventSeveritiesSort = clearEventSeveritiesSort;
exports.clearEventSeverityFilters = clearEventSeverityFilters;
exports.clearEventTypeFilters = clearEventTypeFilters;
exports.clearEventTypesSort = clearEventTypesSort;
exports.clearEventsSort = clearEventsSort;
exports.clearFeatureFilters = clearFeatureFilters;
exports.clearFeaturesSort = clearFeaturesSort;
exports.clearFocalPeopleSort = clearFocalPeopleSort;
exports.clearFocalPersonFilters = clearFocalPersonFilters;
exports.clearNotificationTemplateFilters = clearNotificationTemplateFilters;
exports.clearNotificationTemplatesSort = clearNotificationTemplatesSort;
exports.clearPartyRoleFilters = clearPartyRoleFilters;
exports.clearPartyRolesSort = clearPartyRolesSort;
exports.closeAdministrativeAreaForm = closeAdministrativeAreaForm;
exports.closeAgencyForm = closeAgencyForm;
exports.closeChangelogForm = closeChangelogForm;
exports.closeEventActionForm = closeEventActionForm;
exports.closeEventCertaintyForm = closeEventCertaintyForm;
exports.closeEventForm = closeEventForm;
exports.closeEventFunctionForm = closeEventFunctionForm;
exports.closeEventGroupForm = closeEventGroupForm;
exports.closeEventIndicatorForm = closeEventIndicatorForm;
exports.closeEventQuestionForm = closeEventQuestionForm;
exports.closeEventSeverityForm = closeEventSeverityForm;
exports.closeEventTypeForm = closeEventTypeForm;
exports.closeFeatureForm = closeFeatureForm;
exports.closeFocalPersonForm = closeFocalPersonForm;
exports.closeNotificationTemplateForm = closeNotificationTemplateForm;
exports.closePartyRoleForm = closePartyRoleForm;
exports.deleteAdministrativeArea = deleteAdministrativeArea;
exports.deleteAgency = deleteAgency;
exports.deleteChangelog = deleteChangelog;
exports.deleteEvent = deleteEvent;
exports.deleteEventAction = deleteEventAction;
exports.deleteEventCertainty = deleteEventCertainty;
exports.deleteEventFunction = deleteEventFunction;
exports.deleteEventGroup = deleteEventGroup;
exports.deleteEventIndicator = deleteEventIndicator;
exports.deleteEventQuestion = deleteEventQuestion;
exports.deleteEventSeverity = deleteEventSeverity;
exports.deleteEventType = deleteEventType;
exports.deleteFeature = deleteFeature;
exports.deleteFocalPerson = deleteFocalPerson;
exports.deleteNotificationTemplate = deleteNotificationTemplate;
exports.deletePartyRole = deletePartyRole;
exports.filterAdministrativeAreas = filterAdministrativeAreas;
exports.filterAgencies = filterAgencies;
exports.filterChangelogs = filterChangelogs;
exports.filterEventActions = filterEventActions;
exports.filterEventCertainties = filterEventCertainties;
exports.filterEventFunctions = filterEventFunctions;
exports.filterEventGroups = filterEventGroups;
exports.filterEventIndicators = filterEventIndicators;
exports.filterEventQuestions = filterEventQuestions;
exports.filterEventSeverities = filterEventSeverities;
exports.filterEventTypes = filterEventTypes;
exports.filterEvents = filterEvents;
exports.filterFeatures = filterFeatures;
exports.filterFocalPeople = filterFocalPeople;
exports.filterNotificationTemplates = filterNotificationTemplates;
exports.filterPartyRoles = filterPartyRoles;
exports.getAdministrativeArea = getAdministrativeArea;
exports.getAdministrativeAreas = getAdministrativeAreas;
exports.getAgencies = getAgencies;
exports.getAgency = getAgency;
exports.getChangelog = getChangelog;
exports.getChangelogs = getChangelogs;
exports.getEvent = getEvent;
exports.getEventAction = getEventAction;
exports.getEventActions = getEventActions;
exports.getEventCertainties = getEventCertainties;
exports.getEventCertainty = getEventCertainty;
exports.getEventFunction = getEventFunction;
exports.getEventFunctions = getEventFunctions;
exports.getEventGroup = getEventGroup;
exports.getEventGroups = getEventGroups;
exports.getEventIndicator = getEventIndicator;
exports.getEventIndicators = getEventIndicators;
exports.getEventQuestion = getEventQuestion;
exports.getEventQuestions = getEventQuestions;
exports.getEventSeverities = getEventSeverities;
exports.getEventSeverity = getEventSeverity;
exports.getEventType = getEventType;
exports.getEventTypes = getEventTypes;
exports.getEvents = getEvents;
exports.getFeature = getFeature;
exports.getFeatures = getFeatures;
exports.getFocalPeople = getFocalPeople;
exports.getFocalPerson = getFocalPerson;
exports.getNotificationTemplate = getNotificationTemplate;
exports.getNotificationTemplates = getNotificationTemplates;
exports.getPartyRole = getPartyRole;
exports.getPartyRoles = getPartyRoles;
exports.initializeApp = wrappedInitializeApp;
exports.loadMoreAdministrativeAreas = loadMoreAdministrativeAreas;
exports.loadMoreAgencies = loadMoreAgencies;
exports.loadMoreChangelogs = loadMoreChangelogs;
exports.loadMoreEventActions = loadMoreEventActions;
exports.loadMoreEventCertainties = loadMoreEventCertainties;
exports.loadMoreEventFunctions = loadMoreEventFunctions;
exports.loadMoreEventGroups = loadMoreEventGroups;
exports.loadMoreEventIndicators = loadMoreEventIndicators;
exports.loadMoreEventQuestions = loadMoreEventQuestions;
exports.loadMoreEventSeverities = loadMoreEventSeverities;
exports.loadMoreEventTypes = loadMoreEventTypes;
exports.loadMoreEvents = loadMoreEvents;
exports.loadMoreFeatures = loadMoreFeatures;
exports.loadMoreFocalPeople = loadMoreFocalPeople;
exports.loadMoreNotificationTemplates = loadMoreNotificationTemplates;
exports.loadMorePartyRoles = loadMorePartyRoles;
exports.openAdministrativeAreaForm = openAdministrativeAreaForm;
exports.openAgencyForm = openAgencyForm;
exports.openChangelogForm = openChangelogForm;
exports.openEventActionForm = openEventActionForm;
exports.openEventCertaintyForm = openEventCertaintyForm;
exports.openEventForm = openEventForm;
exports.openEventFunctionForm = openEventFunctionForm;
exports.openEventGroupForm = openEventGroupForm;
exports.openEventIndicatorForm = openEventIndicatorForm;
exports.openEventQuestionForm = openEventQuestionForm;
exports.openEventSeverityForm = openEventSeverityForm;
exports.openEventTypeForm = openEventTypeForm;
exports.openFeatureForm = openFeatureForm;
exports.openFocalPersonForm = openFocalPersonForm;
exports.openNotificationTemplateForm = openNotificationTemplateForm;
exports.openPartyRoleForm = openPartyRoleForm;
exports.paginateAdministrativeAreas = paginateAdministrativeAreas;
exports.paginateAgencies = paginateAgencies;
exports.paginateChangelogs = paginateChangelogs;
exports.paginateEventActions = paginateEventActions;
exports.paginateEventCertainties = paginateEventCertainties;
exports.paginateEventFunctions = paginateEventFunctions;
exports.paginateEventGroups = paginateEventGroups;
exports.paginateEventIndicators = paginateEventIndicators;
exports.paginateEventQuestions = paginateEventQuestions;
exports.paginateEventSeverities = paginateEventSeverities;
exports.paginateEventTypes = paginateEventTypes;
exports.paginateEvents = paginateEvents;
exports.paginateFeatures = paginateFeatures;
exports.paginateFocalPeople = paginateFocalPeople;
exports.paginateNotificationTemplates = paginateNotificationTemplates;
exports.paginatePartyRoles = paginatePartyRoles;
exports.postAdministrativeArea = postAdministrativeArea;
exports.postAgency = postAgency;
exports.postChangelog = postChangelog;
exports.postEvent = postEvent;
exports.postEventAction = postEventAction;
exports.postEventCertainty = postEventCertainty;
exports.postEventFunction = postEventFunction;
exports.postEventGroup = postEventGroup;
exports.postEventIndicator = postEventIndicator;
exports.postEventQuestion = postEventQuestion;
exports.postEventSeverity = postEventSeverity;
exports.postEventType = postEventType;
exports.postFeature = postFeature;
exports.postFocalPerson = postFocalPerson;
exports.postNotificationTemplate = postNotificationTemplate;
exports.postPartyRole = postPartyRole;
exports.putAdministrativeArea = putAdministrativeArea;
exports.putAgency = putAgency;
exports.putChangelog = putChangelog;
exports.putEvent = putEvent;
exports.putEventAction = putEventAction;
exports.putEventCertainty = putEventCertainty;
exports.putEventFunction = putEventFunction;
exports.putEventGroup = putEventGroup;
exports.putEventIndicator = putEventIndicator;
exports.putEventQuestion = putEventQuestion;
exports.putEventSeverity = putEventSeverity;
exports.putEventType = putEventType;
exports.putFeature = putFeature;
exports.putFocalPerson = putFocalPerson;
exports.putNotificationTemplate = putNotificationTemplate;
exports.putPartyRole = putPartyRole;
exports.refreshAdministrativeAreas = refreshAdministrativeAreas;
exports.refreshAgencies = refreshAgencies;
exports.refreshChangelogs = refreshChangelogs;
exports.refreshEventActions = refreshEventActions;
exports.refreshEventCertainties = refreshEventCertainties;
exports.refreshEventFunctions = refreshEventFunctions;
exports.refreshEventGroups = refreshEventGroups;
exports.refreshEventIndicators = refreshEventIndicators;
exports.refreshEventQuestions = refreshEventQuestions;
exports.refreshEventSeverities = refreshEventSeverities;
exports.refreshEventTypes = refreshEventTypes;
exports.refreshEvents = refreshEvents;
exports.refreshFeatures = refreshFeatures;
exports.refreshFocalPeople = refreshFocalPeople;
exports.refreshNotificationTemplates = refreshNotificationTemplates;
exports.refreshPartyRoles = refreshPartyRoles;
exports.searchAdministrativeAreas = searchAdministrativeAreas;
exports.searchAgencies = searchAgencies;
exports.searchChangelogs = searchChangelogs;
exports.searchEventActions = searchEventActions;
exports.searchEventCertainties = searchEventCertainties;
exports.searchEventFunctions = searchEventFunctions;
exports.searchEventGroups = searchEventGroups;
exports.searchEventIndicators = searchEventIndicators;
exports.searchEventQuestions = searchEventQuestions;
exports.searchEventSeverities = searchEventSeverities;
exports.searchEventTypes = searchEventTypes;
exports.searchEvents = searchEvents;
exports.searchFeatures = searchFeatures;
exports.searchFocalPeople = searchFocalPeople;
exports.searchNotificationTemplates = searchNotificationTemplates;
exports.searchPartyRoles = searchPartyRoles;
exports.selectAdministrativeArea = selectAdministrativeArea;
exports.selectAgency = selectAgency;
exports.selectChangelog = selectChangelog;
exports.selectEvent = selectEvent;
exports.selectEventAction = selectEventAction;
exports.selectEventCertainty = selectEventCertainty;
exports.selectEventFunction = selectEventFunction;
exports.selectEventGroup = selectEventGroup;
exports.selectEventIndicator = selectEventIndicator;
exports.selectEventQuestion = selectEventQuestion;
exports.selectEventSeverity = selectEventSeverity;
exports.selectEventType = selectEventType;
exports.selectFeature = selectFeature;
exports.selectFocalPerson = selectFocalPerson;
exports.selectNotificationTemplate = selectNotificationTemplate;
exports.selectPartyRole = selectPartyRole;
exports.setAdministrativeAreaSchema = setAdministrativeAreaSchema;
exports.setAgencySchema = setAgencySchema;
exports.setChangelogSchema = setChangelogSchema;
exports.setEventActionSchema = setEventActionSchema;
exports.setEventCertaintySchema = setEventCertaintySchema;
exports.setEventFunctionSchema = setEventFunctionSchema;
exports.setEventGroupSchema = setEventGroupSchema;
exports.setEventIndicatorSchema = setEventIndicatorSchema;
exports.setEventQuestionSchema = setEventQuestionSchema;
exports.setEventSchema = setEventSchema;
exports.setEventSeveritySchema = setEventSeveritySchema;
exports.setEventTypeSchema = setEventTypeSchema;
exports.setFeatureSchema = setFeatureSchema;
exports.setFocalPersonSchema = setFocalPersonSchema;
exports.setNotificationTemplateSchema = setNotificationTemplateSchema;
exports.setPartyRoleSchema = setPartyRoleSchema;
exports.signin = wrappedSingin;
exports.signout = wrappedSingout;
exports.sortAdministrativeAreas = sortAdministrativeAreas;
exports.sortAgencies = sortAgencies;
exports.sortChangelogs = sortChangelogs;
exports.sortEventActions = sortEventActions;
exports.sortEventCertainties = sortEventCertainties;
exports.sortEventFunctions = sortEventFunctions;
exports.sortEventGroups = sortEventGroups;
exports.sortEventIndicators = sortEventIndicators;
exports.sortEventQuestions = sortEventQuestions;
exports.sortEventSeverities = sortEventSeverities;
exports.sortEventTypes = sortEventTypes;
exports.sortEvents = sortEvents;
exports.sortFeatures = sortFeatures;
exports.sortFocalPeople = sortFocalPeople;
exports.sortNotificationTemplates = sortNotificationTemplates;
exports.sortPartyRoles = sortPartyRoles;
