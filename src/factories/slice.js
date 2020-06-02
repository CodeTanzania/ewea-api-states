import { pluralize, singularize } from 'inflection';
import upperFirst from 'lodash/upperFirst';
import { createSlice } from '@reduxjs/toolkit';
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
    [camelize('select', singular)]: (state, action) => ({
      ...state,
      selected: action.payload,
    }),
    [camelize('filter', plural)]: (state, action) => ({
      ...state,
      filter: action.payload,
    }),
    [camelize('sort', plural)]: (state, action) => ({
      ...state,
      sort: action.payload,
    }),
    [camelize('search', plural)]: (state, action) => ({
      ...state,
      q: action.payload,
    }),
    [camelize('clear', plural, 'filters')]: (state) => ({
      ...state,
      filters: null,
    }),
    [camelize('clear', plural, 'sort')]: (state) => ({ ...state, sort: null }),
    [camelize('get', plural, 'Request')]: (state) => ({
      ...state,
      loading: true,
    }),
    [camelize('get', plural, 'Success')]: (state, action) => ({
      ...state,
      list: [...action.payload.data],
      page: action.payload.page,
      total: action.payload.total,
      size: action.payload.size,
      hasMore: action.payload.hasMore,
      loading: false,
    }),
    [camelize('get', plural, 'Failure')]: (state, action) => ({
      ...state,
      error: action.payload,
      loading: false,
    }),
    [camelize('load', 'more', plural, 'Request')]: (state) => ({
      ...state,
      loading: true,
    }),
    [camelize('load', 'more', plural, 'Success')]: (state, action) => ({
      ...state,
      list: [...state.list, ...action.payload.data],
      page: action.payload.page,
      total: action.payload.total,
      size: action.payload.size,
      hasMore: action.payload.hasMore,
      loading: false,
    }),
    [camelize('load', 'more', plural, 'Failure')]: (state, action) => ({
      ...state,
      error: action.payload,
      loading: false,
    }),
    [camelize('get', singular, 'Request')]: (state) => ({
      ...state,
      loading: true,
    }),
    [camelize('get', singular, 'Success')]: (state, action) => ({
      ...state,
      selected: action.payload,
      loading: false,
    }),
    [camelize('get', singular, 'Failure')]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [camelize('post', singular, 'Request')]: (state) => ({
      ...state,
      posting: true,
    }),
    [camelize('post', singular, 'Success')]: (state) => ({
      ...state,
      posting: false,
      showForm: false,
    }),
    [camelize('post', singular, 'Failure')]: (state, action) => ({
      ...state,
      error: action.payload,
      posting: false,
    }),
    [camelize('put', singular, 'Request')]: (state) => ({
      ...state,
      posting: true,
    }),
    [camelize('put', singular, 'Success')]: (state, action) => ({
      ...state,
      selected: action.payload,
      posting: false,
      showForm: false,
    }),
    [camelize('put', singular, 'Failure')]: (state, action) => ({
      ...state,
      posting: false,
      error: action.payload,
    }),
    [camelize('delete', singular, 'Request')]: (state) => ({
      ...state,
      posting: true,
    }),
    [camelize('delete', singular, 'Success')]: (state) => ({
      ...state,
      posting: false,
    }),
    [camelize('delete', singular, 'Failure')]: (state, action) => ({
      ...state,
      posting: false,
      error: action.payload,
    }),
    [camelize('open', singular, 'Form')]: (state) => ({
      ...state,
      showForm: true,
    }),
    [camelize('close', singular, 'Form')]: (state) => ({
      ...state,
      showForm: false,
    }),
    [camelize('set', singular, 'Schema')]: (state, action) => ({
      ...state,
      schema: action.payload,
    }),
  };
}

/**
 * @function
 * @name getReportDefaultReducer
 * @description Generate defaultReducers for reports object
 *
 * @param {string} report Report Name
 * @returns {object} Report reducers
 *
 * @version 0.1.0
 * @since 0.20.0
 */
export function getReportDefaultReducer(report) {
  const plural = pluralize(report);

  return {
    [camelize('get', plural, 'report', 'request')]: (state) => ({
      ...state,
      loading: true,
    }),
    [camelize('get', plural, 'report', 'success')]: (state, action) => ({
      ...state,
      data: action.payload.data,
      loading: false,
    }),
    [camelize('get', plural, 'report', 'failure')]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
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
    total: 1,
    pages: 1,
    size: 0,
    loading: false,
    posting: false,
    showForm: false,
    schema: null,
    filter: null,
    sort: null,
    q: undefined,
    hasMore: false,
  };
}

/**
 * @function
 * @name getDefaultInitialState
 * @description Create initial state for a report resource
 * @returns {object} initial state for report state
 * @version 0.1.0
 * @since 0.20.0
 */
export function getDefaultReportInitialState() {
  return {
    data: null,
    error: null,
    loading: false,
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
export function createSliceFor(
  sliceName,
  initialState = null,
  reducers = null
) {
  const defaultReducers = reducers || getDefaultReducers(sliceName);
  const initialDefaultState = initialState || getDefaultInitialState();

  return createSlice({
    name: sliceName,
    initialState: initialDefaultState,
    reducers: defaultReducers,
  });
}
