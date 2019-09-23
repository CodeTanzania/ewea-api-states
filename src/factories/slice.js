import { pluralize, singularize } from 'inflection';
import isObject from 'lodash/isObject';
import upperFirst from 'lodash/upperFirst';
import { createSlice } from 'redux-starter-kit';
import { camelize } from '../utils';

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
export function getDefaultReducers(resourceName) {
  const plural = upperFirst(pluralize(resourceName));
  const singular = upperFirst(singularize(resourceName));

  return {
    [camelize('select', singular)]: (state, action) =>
      Object.assign({}, state, { selected: action.payload }),
    [camelize('filter', plural)]: (state, action) =>
      Object.assign({}, state, { filter: action.payload }),
    [camelize('sort', plural)]: (state, action) =>
      Object.assign({}, state, { sort: action.payload }),
    [camelize('search', plural)]: (state, action) =>
      Object.assign({}, state, { q: action.payload }),
    [camelize('clear', plural, 'filters')]: state =>
      Object.assign({}, state, { filters: null }),
    [camelize('clear', plural, 'sort')]: state =>
      Object.assign({}, state, { sort: null }),
    [camelize('get', plural, 'Request')]: state =>
      Object.assign({}, state, { loading: true }),
    [camelize('get', plural, 'Success')]: (state, action) =>
      Object.assign({}, state, {
        list: [...action.payload.data],
        page: action.payload.page,
        total: action.payload.total,
        size: action.payload.size,
        loading: false,
      }),
    [camelize('get', plural, 'Failure')]: (state, action) =>
      Object.assign({}, state, { error: action.payload, loading: false }),
    [camelize('get', singular, 'Request')]: state =>
      Object.assign({}, state, { loading: true }),
    [camelize('get', singular, 'Success')]: state =>
      Object.assign({}, state, { loading: false }),
    [camelize('get', singular, 'Failure')]: (state, action) =>
      Object.assign({}, state, { loading: false, error: action.payload }),
    [camelize('post', singular, 'Request')]: state =>
      Object.assign({}, state, { posting: true }),
    [camelize('post', singular, 'Success')]: state =>
      Object.assign({}, state, { posting: false, showForm: false }),
    [camelize('post', singular, 'Failure')]: (state, action) =>
      Object.assign({}, state, { error: action.payload, posting: false }),
    [camelize('put', singular, 'Request')]: state =>
      Object.assign({}, state, { posting: true }),
    [camelize('put', singular, 'Success')]: state =>
      Object.assign({}, state, { posting: false, showForm: false }),
    [camelize('put', singular, 'Failure')]: (state, action) =>
      Object.assign({}, state, { posting: false, error: action.payload }),
    [camelize('delete', singular, 'Request')]: state =>
      Object.assign({}, state, { posting: true }),
    [camelize('delete', singular, 'Success')]: state =>
      Object.assign({}, state, { posting: false }),
    [camelize('delete', singular, 'Failure')]: (state, action) =>
      Object.assign({}, state, { posting: false, error: action.payload }),
    [camelize('open', singular, 'Form')]: state =>
      Object.assign({}, state, { showForm: true }),
    [camelize('close', singular, 'Form')]: state =>
      Object.assign({}, state, { showForm: false }),
    [camelize('set', singular, 'Schema')]: (state, action) =>
      Object.assign({}, state, { schema: action.payload }),
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
export function getDefaultInitialState() {
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
export default function createSliceFor(
  sliceName,
  initialState = null,
  reducers = null
) {
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
    reducers: defaultReducers,
  });
}
