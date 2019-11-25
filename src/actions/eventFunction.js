import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventFunctionActions = generateExposedActions(
  'eventFunction',
  actions,
  dispatch
);

export const {
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
} = eventFunctionActions;
