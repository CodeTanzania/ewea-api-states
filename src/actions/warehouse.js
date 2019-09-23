import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const warehouseActions = generateExposedActions('warehouse', actions, dispatch);

export const {
  clearWarehouseFilters,
  clearWarehousesSort,
  closeWarehouseForm,
  deleteWarehouse,
  filterWarehouses,
  getWarehouses,
  getWarehouse,
  selectWarehouse,
  openWarehouseForm,
  paginateWarehouses,
  postWarehouse,
  putWarehouse,
  refreshWarehouses,
  searchWarehouses,
  setWarehouseSchema,
  sortWarehouses,
} = warehouseActions;
