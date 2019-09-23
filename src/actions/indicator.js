import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const indicatorActions = generateExposedActions('indicator', actions, dispatch);

export const {
  clearIndicatorFilters,
  clearIndicatorsSort,
  closeIndicatorForm,
  deleteIndicator,
  filterIndicators,
  getIndicators,
  getIndicator,
  selectIndicator,
  openIndicatorForm,
  paginateIndicators,
  postIndicator,
  putIndicator,
  refreshIndicators,
  searchIndicators,
  setIndicatorSchema,
  sortIndicators,
} = indicatorActions;
