import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventResponseActions = generateExposedActions(
  'eventResponse',
  actions,
  dispatch
);

export const {
  clearEventResponseFilters,
  clearEventResponsesSort,
  closeEventResponseForm,
  deleteEventResponse,
  filterEventResponses,
  getEventResponses,
  getEventResponse,
  selectEventResponse,
  openEventResponseForm,
  paginateEventResponses,
  postEventResponse,
  putEventResponse,
  refreshEventResponses,
  searchEventResponses,
  setEventResponseSchema,
  sortEventResponses,
  loadMoreEventResponses,
} = eventResponseActions;
