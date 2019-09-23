import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const itemCategoryActions = generateExposedActions(
  'itemCategory',
  actions,
  dispatch
);

export const {
  clearItemCategoryFilters,
  clearItemCategoriesSort,
  closeItemCategoryForm,
  deleteItemCategory,
  filterItemCategories,
  getItemCategories,
  getItemCategory,
  selectItemCategory,
  openItemCategoryForm,
  paginateItemCategories,
  postItemCategory,
  putItemCategory,
  refreshItemCategories,
  searchItemCategories,
  setItemCategorySchema,
  sortItemCategories,
} = itemCategoryActions;
