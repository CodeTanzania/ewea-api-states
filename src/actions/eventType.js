import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventTypeActions = generateExposedActions('eventType', actions, dispatch);

export const {
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
  loadMoreEventTypes,
} = eventTypeActions;
