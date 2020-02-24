import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventLevelActions = generateExposedActions(
  'eventLevel',
  actions,
  dispatch
);

export const {
  clearEventLevelFilters,
  clearEventLevelsSort,
  closeEventLevelForm,
  deleteEventLevel,
  filterEventLevels,
  getEventLevels,
  getEventLevel,
  selectEventLevel,
  openEventLevelForm,
  paginateEventLevels,
  postEventLevel,
  putEventLevel,
  refreshEventLevels,
  searchEventLevels,
  setEventLevelSchema,
  sortEventLevels,
  loadMoreEventLevels,
} = eventLevelActions;
