import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const activityActions = generateExposedActions('activity', actions, dispatch);

export const {
  clearActivityFilters,
  clearActivitiesSort,
  closeActivityForm,
  deleteActivity,
  filterActivities,
  getActivities,
  getActivity,
  selectActivity,
  openActivityForm,
  paginateActivities,
  postActivity,
  putActivity,
  refreshActivities,
  searchActivities,
  setActivitySchema,
  sortActivities,
} = activityActions;
