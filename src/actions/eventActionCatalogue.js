import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventActionCatalogueActions = generateExposedActions(
  'eventActionCatalogue',
  actions,
  dispatch
);

export const {
  clearEventActionCatalogueFilters,
  clearEventActionCataloguesSort,
  closeEventActionCatalogueForm,
  deleteEventActionCatalogue,
  filterEventActionCatalogues,
  getEventActionCatalogues,
  getEventActionCatalogue,
  selectEventActionCatalogue,
  openEventActionCatalogueForm,
  paginateEventActionCatalogues,
  postEventActionCatalogue,
  putEventActionCatalogue,
  refreshEventActionCatalogues,
  searchEventActionCatalogues,
  setEventActionCatalogueSchema,
  sortEventActionCatalogues,
  loadMoreEventActionCatalogues,
} = eventActionCatalogueActions;
