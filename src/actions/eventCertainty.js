import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventCertaintyActions = generateExposedActions(
  'eventCertainty',
  actions,
  dispatch
);

export const {
  clearEventCertaintyFilters,
  clearEventCertaintiesSort,
  closeEventCertaintyForm,
  deleteEventCertainty,
  filterEventCertainties,
  getEventCertainties,
  getEventCertainty,
  selectEventCertainty,
  openEventCertaintyForm,
  paginateEventCertainties,
  postEventCertainty,
  putEventCertainty,
  refreshEventCertainties,
  searchEventCertainties,
  setEventCertaintySchema,
  sortEventCertainties,
  loadMoreEventCertainties,
} = eventCertaintyActions;
