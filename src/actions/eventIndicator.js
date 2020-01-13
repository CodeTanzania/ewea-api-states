import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventIndicatorActions = generateExposedActions(
  'eventIndicator',
  actions,
  dispatch
);

export const {
  clearEventIndicatorFilters,
  clearEventIndicatorsSort,
  closeEventIndicatorForm,
  deleteEventIndicator,
  filterEventIndicators,
  getEventIndicators,
  getEventIndicator,
  selectEventIndicator,
  openEventIndicatorForm,
  paginateEventIndicators,
  postEventIndicator,
  putEventIndicator,
  refreshEventIndicators,
  searchEventIndicators,
  setEventIndicatorSchema,
  sortEventIndicators,
} = eventIndicatorActions;
