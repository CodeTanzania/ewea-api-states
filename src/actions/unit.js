import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const unitActions = generateExposedActions('unit', actions, dispatch);

export const {
  clearUnitFilters,
  clearUnitsSort,
  closeUnitForm,
  deleteUnit,
  filterUnits,
  getUnits,
  getUnit,
  selectUnit,
  openUnitForm,
  paginateUnits,
  postUnit,
  putUnit,
  refreshUnits,
  searchUnits,
  setUnitSchema,
  sortUnits,
  loadMoreUnits,
} = unitActions;
