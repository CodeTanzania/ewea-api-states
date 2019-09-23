import forIn from 'lodash/forIn';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider, connect } from 'react-redux';
import merge from 'lodash/merge';
import { combineReducers } from 'redux';
import { createSlice, configureStore } from 'redux-starter-kit';
import { getAuthenticatedParty, httpActions, signin as signin$1, signout as signout$1 } from '@codetanzania/emis-api-client';
import { pluralize, singularize } from 'inflection';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import lowerFirst from 'lodash/lowerFirst';
import pick from 'lodash/pick';
import { isFunction as isFunction$1 } from 'lodash';

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
    reducers[pluralize(resource)] = slices[resource].reducer;
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
  const plural = upperFirst(pluralize(resourceName));
  const singular = upperFirst(singularize(resourceName));
  return {
    [camelize('select', singular)]: (state, action) => Object.assign({}, state, {
      selected: action.payload
    }),
    [camelize('filter', plural)]: (state, action) => Object.assign({}, state, {
      filter: action.payload
    }),
    [camelize('sort', plural)]: (state, action) => Object.assign({}, state, {
      sort: action.payload
    }),
    [camelize('search', plural)]: (state, action) => Object.assign({}, state, {
      q: action.payload
    }),
    [camelize('clear', plural, 'filters')]: state => Object.assign({}, state, {
      filters: null
    }),
    [camelize('clear', plural, 'sort')]: state => Object.assign({}, state, {
      sort: null
    }),
    [camelize('get', plural, 'Request')]: state => Object.assign({}, state, {
      loading: true
    }),
    [camelize('get', plural, 'Success')]: (state, action) => Object.assign({}, state, {
      list: [...action.payload.data],
      page: action.payload.page,
      total: action.payload.total,
      size: action.payload.size,
      loading: false
    }),
    [camelize('get', plural, 'Failure')]: (state, action) => Object.assign({}, state, {
      error: action.payload,
      loading: false
    }),
    [camelize('get', singular, 'Request')]: state => Object.assign({}, state, {
      loading: true
    }),
    [camelize('get', singular, 'Success')]: state => Object.assign({}, state, {
      loading: false
    }),
    [camelize('get', singular, 'Failure')]: (state, action) => Object.assign({}, state, {
      loading: false,
      error: action.payload
    }),
    [camelize('post', singular, 'Request')]: state => Object.assign({}, state, {
      posting: true
    }),
    [camelize('post', singular, 'Success')]: state => Object.assign({}, state, {
      posting: false,
      showForm: false
    }),
    [camelize('post', singular, 'Failure')]: (state, action) => Object.assign({}, state, {
      error: action.payload,
      posting: false
    }),
    [camelize('put', singular, 'Request')]: state => Object.assign({}, state, {
      posting: true
    }),
    [camelize('put', singular, 'Success')]: state => Object.assign({}, state, {
      posting: false,
      showForm: false
    }),
    [camelize('put', singular, 'Failure')]: (state, action) => Object.assign({}, state, {
      posting: false,
      error: action.payload
    }),
    [camelize('delete', singular, 'Request')]: state => Object.assign({}, state, {
      posting: true
    }),
    [camelize('delete', singular, 'Success')]: state => Object.assign({}, state, {
      posting: false
    }),
    [camelize('delete', singular, 'Failure')]: (state, action) => Object.assign({}, state, {
      posting: false,
      error: action.payload
    }),
    [camelize('open', singular, 'Form')]: state => Object.assign({}, state, {
      showForm: true
    }),
    [camelize('close', singular, 'Form')]: state => Object.assign({}, state, {
      showForm: false
    }),
    [camelize('set', singular, 'Schema')]: (state, action) => Object.assign({}, state, {
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

  return createSlice({
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
  party: getAuthenticatedParty()
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
      return Object.assign({}, state, {
        loading: true
      });

    case INITIALIZE_APP_SUCCESS:
      return Object.assign({}, state, {
        loading: false
      });

    case INITIALIZE_APP_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        error: action.payload
      });

    case SIGNIN_APP_START:
      return Object.assign({}, state, {
        signing: true
      });

    case SIGNIN_APP_SUCCESS:
      return Object.assign({}, state, {
        party: action.payload,
        signing: false
      });

    case SIGNIN_APP_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        signing: false
      });

    case SIGNOUT:
      return Object.assign({}, state, {
        error: null,
        party: null
      });

    default:
      return state;
  }
} // all resources exposed by this library

const resources = ['activity', 'adjustment', 'agency', 'alert', 'alertSource', 'assessment', 'campaign', 'district', 'feature', 'incident', 'incidentType', 'indicator', 'item', 'itemCategory', 'itemUnit', 'message', 'plan', 'procedure', 'question', 'questionnaire', 'region', 'resource', 'role', 'focalPerson', 'stock', 'warehouse'];
const slices = createResourcesSlices(resources);
const reducers = merge({}, extractReducers(resources, slices), {
  app
});
const rootReducer = combineReducers(reducers);
const store = configureStore({
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
  const pluralName = upperFirst(pluralize(resource));
  const singularName = upperFirst(singularize(resource));
  const resourceName = lowerFirst(singularName);
  const storeKey = lowerFirst(pluralName);
  const thunks = {};
  /**
   * @function
   * @name get<Resource Plural Name>
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
    return httpActions[camelize('get', pluralName)](param).then(data => {
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
   * @name get<Resource Singular Name>
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
    return httpActions[camelize('get', singularName)](id).then(data => {
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
   * @name post<Resource Singular Name>
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
    return httpActions[camelize('post', singularName)](param).then(data => {
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
   * @name put<Resource Singular Name>
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
    return httpActions[camelize('put', singularName)](param).then(data => {
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
   * @name delete<Resource Singular Name>
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
    return httpActions[camelize('delete', singularName)](id).then(data => {
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
   * @name fetch<Resource Name>
   * @description A thunk that for fetching data from the API the difference
   * between this and get thunk is this will apply all the criteria on fetch.
   * Pagination, filters, Search Query and sort.
   *
   * @param {Function} onSuccess Callback to be called when fetching
   * resources from the API succeed
   * @param {Function} onError Callback to be called when fetching
   * resources from the API fails
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
   * @name filter<Resource Plural Name>
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
   * @name refresh<Resource Plural Name>
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
   * @name search<Resource Plural Name>
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
   * @name sort<Resource Plural Name>
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
   * @name paginate<Resource Plural Name>
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
   * @name clear<Resource Singular Name>Filters
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
   * @name clear<Resource Plural Name>Sort
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
  const resourceName = singularize(upperFirst(resource));
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

const activityActions = generateExposedActions('activity', actions, dispatch);
const {
  clearActivityFilters,
  clearActivitiesSort,
  closeActivityForm,
  deleteActivity,
  filterActivities,
  getActivities,
  getActivity,
  selectActivity,
  openActivityForm,
  paginateActivities,
  postActivity,
  putActivity,
  refreshActivities,
  searchActivities,
  setActivitySchema,
  sortActivities
} = activityActions;

const adjustmentActions = generateExposedActions('adjustment', actions, dispatch);
const {
  clearAdjustmentFilters,
  clearAdjustmentsSort,
  closeAdjustmentForm,
  deleteAdjustment,
  filterAdjustments,
  getAdjustments,
  getAdjustment,
  selectAdjustment,
  openAdjustmentForm,
  paginateAdjustments,
  postAdjustment,
  putAdjustment,
  refreshAdjustments,
  searchAdjustments,
  setAdjustmentSchema,
  sortAdjustments
} = adjustmentActions;

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
} = httpActions;
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
        activity: {
          setActivitySchema
        },
        adjustment: {
          setAdjustmentSchema
        },
        agency: {
          setAgencySchema
        },
        alert: {
          setAlertSchema
        },
        alertSource: {
          setAlertSourceSchema
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
        item: {
          setItemSchema
        },
        incidentType: {
          setIncidentTypeSchema
        },
        plan: {
          setPlanSchema
        },
        procedure: {
          setProcedureSchema
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
        },
        stock: {
          setStockSchema
        },
        warehouse: {
          setWarehouseSchema
        }
      } = actions;
      const {
        Activity: activitySchema,
        Adjustment: adjustmentSchema,
        Agency: agencySchema,
        Alert: alertSchema,
        AlertSource: alertSourceSchema,
        District: districtSchema,
        Feature: featureSchema,
        FocalPerson: focalPersonSchema,
        IncidentType: incidentTypeSchema,
        Indicator: indicatorSchema,
        Item: itemSchema,
        Plan: planSchema,
        Procedure: procedureSchema,
        Question: questionSchema,
        Questionnaire: questionnaireSchema,
        Region: regionSchema,
        Role: roleSchema,
        Stock: stockSchema,
        Warehouse: warehouseSchema
      } = schemas;
      dispatch(setActivitySchema(activitySchema));
      dispatch(setAdjustmentSchema(adjustmentSchema));
      dispatch(setAgencySchema(agencySchema));
      dispatch(setAlertSchema(alertSchema));
      dispatch(setAlertSourceSchema(alertSourceSchema));
      dispatch(setDistrictSchema(districtSchema));
      dispatch(setFeatureSchema(featureSchema));
      dispatch(setFocalPersonSchema(focalPersonSchema));
      dispatch(setIndicatorSchema(indicatorSchema));
      dispatch(setIncidentTypeSchema(incidentTypeSchema));
      dispatch(setItemSchema(itemSchema));
      dispatch(setPlanSchema(planSchema));
      dispatch(setProcedureSchema(procedureSchema));
      dispatch(setQuestionSchema(questionSchema));
      dispatch(setQuestionnaireSchema(questionnaireSchema));
      dispatch(setRegionSchema(regionSchema));
      dispatch(setRoleSchema(roleSchema));
      dispatch(setStockSchema(stockSchema));
      dispatch(setWarehouseSchema(warehouseSchema));
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
    return signin$1(credentials).then(results => {
      const {
        party
      } = results;
      dispatch(signinSuccess(party));

      if (isFunction$1(onSuccess)) {
        onSuccess();
      }
    }).catch(error => {
      dispatch(signinFailure(error));

      if (isFunction$1(onError)) {
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
  signout$1(); // clear sessionStorage

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

const itemActions = generateExposedActions('item', actions, dispatch);
const {
  clearItemFilters,
  clearItemsSort,
  closeItemForm,
  deleteItem,
  filterItems,
  getItems,
  getItem,
  selectItem,
  openItemForm,
  paginateItems,
  postItem,
  putItem,
  refreshItems,
  searchItems,
  setItemSchema,
  sortItems
} = itemActions;

const itemCategoryActions = generateExposedActions('itemCategory', actions, dispatch);
const {
  clearItemCategoryFilters,
  clearItemCategoriesSort,
  closeItemCategoryForm,
  deleteItemCategory,
  filterItemCategories,
  getItemCategories,
  getItemCategory,
  selectItemCategory,
  openItemCategoryForm,
  paginateItemCategories,
  postItemCategory,
  putItemCategory,
  refreshItemCategories,
  searchItemCategories,
  setItemCategorySchema,
  sortItemCategories
} = itemCategoryActions;

const itemUnitActions = generateExposedActions('itemUnit', actions, dispatch);
const {
  clearItemUnitFilters,
  clearItemUnitsSort,
  closeItemUnitForm,
  deleteItemUnit,
  filterItemUnits,
  getItemUnits,
  getItemUnit,
  selectItemUnit,
  openItemUnitForm,
  paginateItemUnits,
  postItemUnit,
  putItemUnit,
  refreshItemUnits,
  searchItemUnits,
  setItemUnitSchema,
  sortItemUnits
} = itemUnitActions;

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

const planActions = generateExposedActions('plan', actions, dispatch);
const {
  clearPlanFilters,
  clearPlansSort,
  closePlanForm,
  deletePlan,
  filterPlans,
  getPlans,
  getPlan,
  selectPlan,
  openPlanForm,
  paginatePlans,
  postPlan,
  putPlan,
  refreshPlans,
  searchPlans,
  setPlanSchema,
  sortPlans
} = planActions;

const procedureActions = generateExposedActions('procedure', actions, dispatch);
const {
  clearProcedureFilters,
  clearProceduresSort,
  closeProcedureForm,
  deleteProcedure,
  filterProcedures,
  getProcedures,
  getProcedure,
  selectProcedure,
  openProcedureForm,
  paginateProcedures,
  postProcedure,
  putProcedure,
  refreshProcedures,
  searchProcedures,
  setProcedureSchema,
  sortProcedures
} = procedureActions;

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

const resourceActions = generateExposedActions('resource', actions, dispatch);
const {
  clearResourceFilters,
  clearResourcesSort,
  closeResourceForm,
  deleteResource,
  filterResources,
  getResources,
  getResource,
  selectResource,
  openResourceForm,
  paginateResources,
  postResource,
  putResource,
  refreshResources,
  searchResources,
  setResourceSchema,
  sortResources
} = resourceActions;

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

const stakeholderActions$2 = generateExposedActions('stock', actions, dispatch);
const {
  clearStockFilters,
  clearStocksSort,
  closeStockForm,
  deleteStock,
  filterStocks,
  getStocks,
  getStock,
  selectStock,
  openStockForm,
  paginateStocks,
  postStock,
  putStock,
  refreshStocks,
  searchStocks,
  setStockSchema,
  sortStocks
} = stakeholderActions$2;

const warehouseActions = generateExposedActions('warehouse', actions, dispatch);
const {
  clearWarehouseFilters,
  clearWarehousesSort,
  closeWarehouseForm,
  deleteWarehouse,
  filterWarehouses,
  getWarehouses,
  getWarehouse,
  selectWarehouse,
  openWarehouseForm,
  paginateWarehouses,
  postWarehouse,
  putWarehouse,
  refreshWarehouses,
  searchWarehouses,
  setWarehouseSchema,
  sortWarehouses
} = warehouseActions;

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

function StoreProvider({
  children
}) {
  return React.createElement(Provider, {
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

  return connect(mapStateToProps)(component);
}

export { Connect, StoreProvider, clearActivitiesSort, clearActivityFilters, clearAdjustmentFilters, clearAdjustmentsSort, clearAgenciesSort, clearAgencyFilters, clearAlertFilters, clearAlertSourceFilters, clearAlertSourcesSort, clearAlertsSort, clearAssessmentFilters, clearAssessmentsSort, clearCampaignFilters, clearCampaignsSort, clearDistrictFilters, clearDistrictsSort, clearFeatureFilters, clearFeaturesSort, clearFocalPeopleSort, clearFocalPersonFilters, clearIncidentFilters, clearIncidentTypeFilters, clearIncidentTypesSort, clearIncidentsSort, clearIndicatorFilters, clearIndicatorsSort, clearItemCategoriesSort, clearItemCategoryFilters, clearItemFilters, clearItemUnitFilters, clearItemUnitsSort, clearItemsSort, clearMessageFilters, clearMessagesSort, clearPlanFilters, clearPlansSort, clearProcedureFilters, clearProceduresSort, clearQuestionFilters, clearQuestionnaireFilters, clearQuestionnairesSort, clearQuestionsSort, clearRegionFilters, clearRegionsSort, clearResourceFilters, clearResourcesSort, clearRoleFilters, clearRolesSort, clearStockFilters, clearStocksSort, clearWarehouseFilters, clearWarehousesSort, closeActivityForm, closeAdjustmentForm, closeAgencyForm, closeAlertForm, closeAlertSourceForm, closeAssessmentForm, closeCampaignForm, closeDistrictForm, closeFeatureForm, closeFocalPersonForm, closeIncidentForm, closeIncidentTypeForm, closeIndicatorForm, closeItemCategoryForm, closeItemForm, closeItemUnitForm, closeMessageForm, closePlanForm, closeProcedureForm, closeQuestionForm, closeQuestionnaireForm, closeRegionForm, closeResourceForm, closeRoleForm, closeStockForm, closeWarehouseForm, deleteActivity, deleteAdjustment, deleteAgency, deleteAlert, deleteAlertSource, deleteAssessment, deleteCampaign, deleteDistrict, deleteFeature, deleteFocalPerson, deleteIncident, deleteIncidentType, deleteIndicator, deleteItem, deleteItemCategory, deleteItemUnit, deleteMessage, deletePlan, deleteProcedure, deleteQuestion, deleteQuestionnaire, deleteRegion, deleteResource, deleteRole, deleteStock, deleteWarehouse, filterActivities, filterAdjustments, filterAgencies, filterAlertSources, filterAlerts, filterAssessments, filterCampaigns, filterDistricts, filterFeatures, filterFocalPeople, filterIncidentTypes, filterIncidents, filterIndicators, filterItemCategories, filterItemUnits, filterItems, filterMessages, filterPlans, filterProcedures, filterQuestionnaires, filterQuestions, filterRegions, filterResources, filterRoles, filterStocks, filterWarehouses, getActivities, getActivity, getAdjustment, getAdjustments, getAgencies, getAgency, getAlert, getAlertSource, getAlertSources, getAlerts, getAssessment, getAssessments, getCampaign, getCampaigns, getDistrict, getDistricts, getFeature, getFeatures, getFocalPeople, getFocalPerson, getIncident, getIncidentType, getIncidentTypes, getIncidents, getIndicator, getIndicators, getItem, getItemCategories, getItemCategory, getItemUnit, getItemUnits, getItems, getMessage, getMessages, getPlan, getPlans, getProcedure, getProcedures, getQuestion, getQuestionnaire, getQuestionnaires, getQuestions, getRegion, getRegions, getResource, getResources, getRole, getRoles, getStock, getStocks, getWarehouse, getWarehouses, wrappedInitializeApp as initializeApp, openActivityForm, openAdjustmentForm, openAgencyForm, openAlertForm, openAlertSourceForm, openAssessmentForm, openCampaignForm, openDistrictForm, openFeatureForm, openFocalPersonForm, openIncidentForm, openIncidentTypeForm, openIndicatorForm, openItemCategoryForm, openItemForm, openItemUnitForm, openMessageForm, openPlanForm, openProcedureForm, openQuestionForm, openQuestionnaireForm, openRegionForm, openResourceForm, openRoleForm, openStockForm, openWarehouseForm, paginateActivities, paginateAdjustments, paginateAgencies, paginateAlertSources, paginateAlerts, paginateAssessments, paginateCampaigns, paginateDistricts, paginateFeatures, paginateFocalPeople, paginateIncidentTypes, paginateIncidents, paginateIndicators, paginateItemCategories, paginateItemUnits, paginateItems, paginateMessages, paginatePlans, paginateProcedures, paginateQuestionnaires, paginateQuestions, paginateRegions, paginateResources, paginateRoles, paginateStocks, paginateWarehouses, postActivity, postAdjustment, postAgency, postAlert, postAlertSource, postAssessment, postCampaign, postDistrict, postFeature, postFocalPerson, postIncident, postIncidentType, postIndicator, postItem, postItemCategory, postItemUnit, postMessage, postPlan, postProcedure, postQuestion, postQuestionnaire, postRegion, postResource, postRole, postStock, postWarehouse, putActivity, putAdjustment, putAgency, putAlert, putAlertSource, putAssessment, putCampaign, putDistrict, putFeature, putFocalPerson, putIncident, putIncidentType, putIndicator, putItem, putItemCategory, putItemUnit, putMessage, putPlan, putProcedure, putQuestion, putQuestionnaire, putRegion, putResource, putRole, putStock, putWarehouse, refreshActivities, refreshAdjustments, refreshAgencies, refreshAlertSources, refreshAlerts, refreshAssessments, refreshCampaigns, refreshDistricts, refreshFeatures, refreshFocalPeople, refreshIncidentTypes, refreshIncidents, refreshIndicators, refreshItemCategories, refreshItemUnits, refreshItems, refreshMessages, refreshPlans, refreshProcedures, refreshQuestionnaires, refreshQuestions, refreshRegions, refreshResources, refreshRoles, refreshStocks, refreshWarehouses, searchActivities, searchAdjustments, searchAgencies, searchAlertSources, searchAlerts, searchAssessments, searchCampaigns, searchDistricts, searchFeatures, searchFocalPeople, searchIncidentTypes, searchIncidents, searchIndicators, searchItemCategories, searchItemUnits, searchItems, searchMessages, searchPlans, searchProcedures, searchQuestionnaires, searchQuestions, searchRegions, searchResources, searchRoles, searchStocks, searchWarehouses, selectActivity, selectAdjustment, selectAgency, selectAlert, selectAlertSource, selectAssessment, selectCampaign, selectDistrict, selectFeature, selectFocalPerson, selectIncident, selectIncidentType, selectIndicator, selectItem, selectItemCategory, selectItemUnit, selectMessage, selectPlan, selectProcedure, selectQuestion, selectQuestionnaire, selectRegion, selectResource, selectRole, selectStock, selectWarehouse, setActivitySchema, setAdjustmentSchema, setAgencySchema, setAlertSchema, setAlertSourceSchema, setAssessmentSchema, setCampaignSchema, setDistrictSchema, setFeatureSchema, setFocalPersonSchema, setIncidentSchema, setIncidentTypeSchema, setIndicatorSchema, setItemCategorySchema, setItemSchema, setItemUnitSchema, setMessageSchema, setPlanSchema, setProcedureSchema, setQuestionSchema, setQuestionnaireSchema, setRegionSchema, setResourceSchema, setRoleSchema, setStockSchema, setWarehouseSchema, wrappedSingin as signin, wrappedSingout as signout, sortActivities, sortAdjustments, sortAgencies, sortAlertSources, sortAlerts, sortAssessments, sortCampaigns, sortDistricts, sortFeatures, sortFocalPeople, sortIncidentTypes, sortIncidents, sortIndicators, sortItemCategories, sortItemUnits, sortItems, sortMessages, sortPlans, sortProcedures, sortQuestionnaires, sortQuestions, sortRegions, sortResources, sortRoles, sortStocks, sortWarehouses };
