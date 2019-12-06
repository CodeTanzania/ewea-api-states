import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const administrativeAreaActions = generateExposedActions(
  'administrativeArea',
  actions,
  dispatch
);

export const {
  clearAdministrativeAreaFilters,
  clearAdministrativeAreasSort,
  closeAdministrativeAreaForm,
  deleteAdministrativeArea,
  filterAdministrativeAreas,
  getAdministrativeAreas,
  getAdministrativeArea,
  selectAdministrativeArea,
  openAdministrativeAreaForm,
  paginateAdministrativeAreas,
  postAdministrativeArea,
  putAdministrativeArea,
  refreshAdministrativeAreas,
  searchAdministrativeAreas,
  setAdministrativeAreaSchema,
  sortAdministrativeAreas,
} = administrativeAreaActions;
