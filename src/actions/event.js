import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventActions = generateExposedActions('event', actions, dispatch);

export const {
  clearEventFilters,
  clearEventsSort,
  closeEventForm,
  deleteEvent,
  filterEvents,
  getEvents,
  getEvent,
  selectEvent,
  openEventForm,
  paginateEvents,
  postEvent,
  putEvent,
  refreshEvents,
  searchEvents,
  setEventSchema,
  sortEvents,
} = eventActions;
