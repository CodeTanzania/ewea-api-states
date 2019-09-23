import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const featureActions = generateExposedActions('region', actions, dispatch);

export const {
  clearRegionFilters,
  clearRegionsSort,
  closeRegionForm,
  deleteRegion,
  filterRegions,
  getRegions,
  getRegion,
  selectRegion,
  openRegionForm,
  paginateRegions,
  postRegion,
  putRegion,
  refreshRegions,
  searchRegions,
  setRegionSchema,
  sortRegions,
} = featureActions;
