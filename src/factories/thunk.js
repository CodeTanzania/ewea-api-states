import { httpActions as client } from '@codetanzania/emis-api-client';
import { pluralize, singularize } from 'inflection';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import lowerFirst from 'lodash/lowerFirst';
import pick from 'lodash/pick';
import upperFirst from 'lodash/upperFirst';
import { actions } from '../store';
import { camelize, normalizeError } from '../utils';

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
export default function createThunksFor(resource) {
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
  thunks[camelize('get', pluralName)] = (
    param,
    onSuccess,
    onError
  ) => dispatch => {
    dispatch(actions[resourceName][camelize('get', pluralName, 'request')]());
    return client[camelize('get', pluralName)](param)
      .then(data => {
        dispatch(
          actions[resourceName][camelize('get', pluralName, 'success')](data)
        );

        // custom provided onSuccess callback
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(error => {
        const normalizedError = normalizeError(error);
        dispatch(
          actions[resourceName][camelize('get', pluralName, 'failure')](
            normalizedError
          )
        );

        // custom provided onError callback
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
  thunks[camelize('get', singularName)] = (
    id,
    onSuccess,
    onError
  ) => dispatch => {
    dispatch(actions[resourceName][camelize('get', singularName, 'request')]());
    return client[camelize('get', singularName)](id)
      .then(data => {
        dispatch(
          actions[resourceName][camelize('get', singularName, 'success')](data)
        );

        // custom provided onSuccess callback
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(error => {
        const normalizedError = normalizeError(error);
        dispatch(
          actions[resourceName][camelize('get', singularName, 'failure')](
            normalizedError
          )
        );

        // custom provided onError callback
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
  thunks[camelize('post', singularName)] = (
    param,
    onSuccess,
    onError
  ) => dispatch => {
    dispatch(
      actions[resourceName][camelize('post', singularName, 'request')]()
    );
    return client[camelize('post', singularName)](param)
      .then(data => {
        dispatch(
          actions[resourceName][camelize('post', singularName, 'success')](data)
        );

        dispatch(
          actions[resourceName][camelize('clear', pluralName, 'filters')]()
        );
        dispatch(
          actions[resourceName][camelize('clear', pluralName, 'sort')]()
        );

        dispatch(actions[resourceName][camelize('search', pluralName)]());

        dispatch(thunks[camelize('get', pluralName)]());

        // custom provided onSuccess callback
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(error => {
        const normalizedError = normalizeError(error);
        dispatch(
          actions[resourceName][camelize('post', singularName, 'failure')](
            normalizedError
          )
        );

        // custom provided onError callback
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
  thunks[camelize('put', singularName)] = (
    param,
    onSuccess,
    onError
  ) => dispatch => {
    dispatch(actions[resourceName][camelize('put', singularName, 'request')]());
    return client[camelize('put', singularName)](param)
      .then(data => {
        dispatch(
          actions[resourceName][camelize('put', singularName, 'success')](data)
        );

        dispatch(
          actions[resourceName][camelize('clear', pluralName, 'filters')]()
        );
        dispatch(
          actions[resourceName][camelize('clear', pluralName, 'sort')]()
        );

        dispatch(actions[resourceName][camelize('search', pluralName)]());

        dispatch(thunks[camelize('get', pluralName)]());

        // custom provided onSuccess callback
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(error => {
        const normalizedError = normalizeError(error);
        dispatch(
          actions[resourceName][camelize('put', singularName, 'failure')](
            normalizedError
          )
        );

        // custom provided onError callback
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
  thunks[camelize('delete', singularName)] = (id, onSuccess, onError) => (
    dispatch,
    getState
  ) => {
    dispatch(
      actions[resourceName][camelize('delete', singularName, 'request')]()
    );
    return client[camelize('delete', singularName)](id)
      .then(data => {
        dispatch(
          actions[resourceName][camelize('delete', singularName, 'success')](
            data
          )
        );

        const { page, filter } = getState()[storeKey];

        // custom provided onSuccess callback
        if (isFunction(onSuccess)) {
          onSuccess();
        }

        return dispatch(thunks[camelize('get', pluralName)]({ page, filter }));
      })

      .catch(error => {
        const normalizedError = normalizeError(error);
        dispatch(
          actions[resourceName][camelize('delete', singularName, 'failure')](
            normalizedError
          )
        );

        // custom provided onError callback
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
  thunks[camelize('fetch', pluralName)] = (onSuccess, onError) => (
    dispatch,
    getState
  ) => {
    const { page, sort, filter, q } = getState()[storeKey];

    return dispatch(
      thunks[camelize('get', pluralName)](
        { page, filter, sort, q },
        onSuccess,
        onError
      )
    );
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
  thunks[camelize('filter', pluralName)] = (
    filter,
    onSuccess,
    onError
  ) => dispatch => {
    dispatch(actions[resourceName][camelize('filter', pluralName)](filter));

    return dispatch(
      thunks[camelize('get', pluralName)]({ filter }, onSuccess, onError)
    );
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
  thunks[camelize('refresh', pluralName)] = (onSuccess, onError) => (
    dispatch,
    getState
  ) => {
    const { page, filter, q } = getState()[storeKey];

    return dispatch(
      thunks[camelize('get', pluralName)](
        {
          page,
          filter,
          q,
        },
        onSuccess,
        onError
      )
    );
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
  thunks[camelize('search', pluralName)] = (query, onSuccess, onError) => (
    dispatch,
    getState
  ) => {
    dispatch(actions[resourceName][camelize('search', pluralName)](query));

    const { filter } = getState()[storeKey];

    return dispatch(
      thunks[camelize('get', pluralName)](
        { q: query, filter },
        onSuccess,
        onError
      )
    );
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
  thunks[camelize('sort', pluralName)] = (order, onSuccess, onError) => (
    dispatch,
    getState
  ) => {
    const { page } = getState()[storeKey];

    dispatch(actions[resourceName][camelize('sort', pluralName)](order));

    return dispatch(
      thunks[camelize('get', pluralName)](
        { page, sort: order },
        onSuccess,
        onError
      )
    );
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
  thunks[camelize('paginate', pluralName)] = (page, onSuccess, onError) => (
    dispatch,
    getState
  ) => {
    const { filter, q } = getState()[storeKey];

    return dispatch(
      thunks[camelize('get', pluralName)](
        { page, filter, q },
        onSuccess,
        onError
      )
    );
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
  thunks[camelize('clear', singularName, 'filters')] = (
    onSuccess,
    onError,
    keep = []
  ) => (dispatch, getState) => {
    if (!isEmpty(keep)) {
      // keep specified filters
      let keptFilters = pick(getState()[storeKey].filter, keep);
      keptFilters = isEmpty(keptFilters) ? null : keptFilters;
      return dispatch(
        thunks[camelize('filter', pluralName)](keptFilters, onSuccess, onError)
      );
    }

    // clear all filters
    return dispatch(
      thunks[camelize('filter', pluralName)](null, onSuccess, onError)
    );
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
  thunks[camelize('clear', pluralName, 'sort')] = (onSuccess, onError) => (
    dispatch,
    getState
  ) => {
    const { page } = getState()[storeKey];

    dispatch(actions[resourceName][camelize('clear', pluralName, 'sort')]());

    return dispatch(
      thunks[camelize('get', pluralName)]({ page }, onSuccess, onError)
    );
  };

  return thunks;
}
