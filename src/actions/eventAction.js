import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventActionActions = generateExposedActions(
  'eventAction',
  actions,
  dispatch
);

export const {
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
  loadMoreEventActions,
} = eventActionActions;
