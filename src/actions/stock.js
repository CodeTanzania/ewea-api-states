import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const stakeholderActions = generateExposedActions('stock', actions, dispatch);

export const {
  clearStockFilters,
  clearStocksSort,
  closeStockForm,
  deleteStock,
  filterStocks,
  getStocks,
  getStock,
  selectStock,
  openStockForm,
  paginateStocks,
  postStock,
  putStock,
  refreshStocks,
  searchStocks,
  setStockSchema,
  sortStocks,
} = stakeholderActions;
