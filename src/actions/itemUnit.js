import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const itemUnitActions = generateExposedActions('itemUnit', actions, dispatch);

export const {
  clearItemUnitFilters,
  clearItemUnitsSort,
  closeItemUnitForm,
  deleteItemUnit,
  filterItemUnits,
  getItemUnits,
  getItemUnit,
  selectItemUnit,
  openItemUnitForm,
  paginateItemUnits,
  postItemUnit,
  putItemUnit,
  refreshItemUnits,
  searchItemUnits,
  setItemUnitSchema,
  sortItemUnits,
} = itemUnitActions;
