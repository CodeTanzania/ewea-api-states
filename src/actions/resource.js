import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const resourceActions = generateExposedActions('resource', actions, dispatch);

export const {
  clearResourceFilters,
  clearResourcesSort,
  closeResourceForm,
  deleteResource,
  filterResources,
  getResources,
  getResource,
  selectResource,
  openResourceForm,
  paginateResources,
  postResource,
  putResource,
  refreshResources,
  searchResources,
  setResourceSchema,
  sortResources,
} = resourceActions;
