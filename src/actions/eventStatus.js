import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventStatusActions = generateExposedActions(
  'eventStatus',
  actions,
  dispatch
);

export const {
  clearEventStatusFilters,
  clearEventStatusesSort,
  closeEventStatusForm,
  deleteEventStatus,
  filterEventStatuses,
  getEventStatuses,
  getEventStatus,
  selectEventStatus,
  openEventStatusForm,
  paginateEventStatuses,
  postEventStatus,
  putEventStatus,
  refreshEventStatuses,
  searchEventStatuses,
  setEventStatusSchema,
  sortEventStatuses,
  loadMoreEventStatuses,
} = eventStatusActions;
