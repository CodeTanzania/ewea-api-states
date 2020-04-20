import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const administrativeLevelActions = generateExposedActions(
  'administrativeLevel',
  actions,
  dispatch
);

export const {
  clearAdministrativeLevelFilters,
  clearAdministrativeLevelsSort,
  closeAdministrativeLevelForm,
  deleteAdministrativeLevel,
  filterAdministrativeLevels,
  getAdministrativeLevels,
  getAdministrativeLevel,
  selectAdministrativeLevel,
  openAdministrativeLevelForm,
  paginateAdministrativeLevels,
  postAdministrativeLevel,
  putAdministrativeLevel,
  refreshAdministrativeLevels,
  searchAdministrativeLevels,
  setAdministrativeLevelSchema,
  sortAdministrativeLevels,
  loadMoreAdministrativeLevels,
} = administrativeLevelActions;
