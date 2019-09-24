import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const featureActions = generateExposedActions('district', actions, dispatch);

export const {
  clearDistrictFilters,
  clearDistrictsSort,
  closeDistrictForm,
  deleteDistrict,
  filterDistricts,
  getDistricts,
  getDistrict,
  selectDistrict,
  openDistrictForm,
  paginateDistricts,
  postDistrict,
  putDistrict,
  refreshDistricts,
  searchDistricts,
  setDistrictSchema,
  sortDistricts,
} = featureActions;
