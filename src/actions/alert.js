import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const alertActions = generateExposedActions('alert', actions, dispatch);

export const {
  clearAlertFilters,
  clearAlertsSort,
  closeAlertForm,
  deleteAlert,
  filterAlerts,
  getAlerts,
  getAlert,
  selectAlert,
  openAlertForm,
  paginateAlerts,
  postAlert,
  putAlert,
  refreshAlerts,
  searchAlerts,
  setAlertSchema,
  sortAlerts,
} = alertActions;
