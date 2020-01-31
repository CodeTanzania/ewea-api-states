import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventSeverityActions = generateExposedActions(
  'eventSeverity',
  actions,
  dispatch
);

export const {
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
  loadMoreEventSeverities,
} = eventSeverityActions;
