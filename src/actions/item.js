import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const itemActions = generateExposedActions('item', actions, dispatch);

export const {
  clearItemFilters,
  clearItemsSort,
  closeItemForm,
  deleteItem,
  filterItems,
  getItems,
  getItem,
  selectItem,
  openItemForm,
  paginateItems,
  postItem,
  putItem,
  refreshItems,
  searchItems,
  setItemSchema,
  sortItems,
} = itemActions;
