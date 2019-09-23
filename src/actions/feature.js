import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const featureActions = generateExposedActions('feature', actions, dispatch);

export const {
  clearFeatureFilters,
  clearFeaturesSort,
  closeFeatureForm,
  deleteFeature,
  filterFeatures,
  getFeatures,
  getFeature,
  selectFeature,
  openFeatureForm,
  paginateFeatures,
  postFeature,
  putFeature,
  refreshFeatures,
  searchFeatures,
  setFeatureSchema,
  sortFeatures,
} = featureActions;
