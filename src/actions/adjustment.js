import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const adjustmentActions = generateExposedActions(
  'adjustment',
  actions,
  dispatch
);

export const {
  clearAdjustmentFilters,
  clearAdjustmentsSort,
  closeAdjustmentForm,
  deleteAdjustment,
  filterAdjustments,
  getAdjustments,
  getAdjustment,
  selectAdjustment,
  openAdjustmentForm,
  paginateAdjustments,
  postAdjustment,
  putAdjustment,
  refreshAdjustments,
  searchAdjustments,
  setAdjustmentSchema,
  sortAdjustments,
} = adjustmentActions;
