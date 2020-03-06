import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventUrgencyActions = generateExposedActions(
  'eventUrgency',
  actions,
  dispatch
);

export const {
  clearEventUrgencyFilters,
  clearEventUrgenciesSort,
  closeEventUrgencyForm,
  deleteEventUrgency,
  filterEventUrgencies,
  getEventUrgencies,
  getEventUrgency,
  selectEventUrgency,
  openEventUrgencyForm,
  paginateEventUrgencies,
  postEventUrgency,
  putEventUrgency,
  refreshEventUrgencies,
  searchEventUrgencies,
  setEventUrgencySchema,
  sortEventUrgencies,
  loadMoreEventUrgencies,
} = eventUrgencyActions;
