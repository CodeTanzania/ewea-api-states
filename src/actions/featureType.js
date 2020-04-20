import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const featureTypeActions = generateExposedActions(
  'featureType',
  actions,
  dispatch
);

export const {
  clearFeatureTypeFilters,
  clearFeatureTypesSort,
  closeFeatureTypeForm,
  deleteFeatureType,
  filterFeatureTypes,
  getFeatureTypes,
  getFeatureType,
  selectFeatureType,
  openFeatureTypeForm,
  paginateFeatureTypes,
  postFeatureType,
  putFeatureType,
  refreshFeatureTypes,
  searchFeatureTypes,
  setFeatureTypeSchema,
  sortFeatureTypes,
  loadMoreFeatureTypes,
} = featureTypeActions;
