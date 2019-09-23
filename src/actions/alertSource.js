import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const alertActions = generateExposedActions('alertSource', actions, dispatch);

export const {
  clearAlertSourceFilters,
  clearAlertSourcesSort,
  closeAlertSourceForm,
  deleteAlertSource,
  filterAlertSources,
  getAlertSources,
  getAlertSource,
  selectAlertSource,
  openAlertSourceForm,
  paginateAlertSources,
  postAlertSource,
  putAlertSource,
  refreshAlertSources,
  searchAlertSources,
  setAlertSourceSchema,
  sortAlertSources,
} = alertActions;
