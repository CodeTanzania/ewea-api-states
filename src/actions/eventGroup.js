import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventGroupActions = generateExposedActions(
  'eventGroup',
  actions,
  dispatch
);

export const {
  clearEventGroupFilters,
  clearEventGroupsSort,
  closeEventGroupForm,
  deleteEventGroup,
  filterEventGroups,
  getEventGroups,
  getEventGroup,
  selectEventGroup,
  openEventGroupForm,
  paginateEventGroups,
  postEventGroup,
  putEventGroup,
  refreshEventGroups,
  searchEventGroups,
  setEventGroupSchema,
  sortEventGroups,
} = eventGroupActions;
