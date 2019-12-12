import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const stakeholderActions = generateExposedActions(
  'notificationTemplate',
  actions,
  dispatch
);

export const {
  clearNotificationTemplateFilters,
  clearNotificationTemplatesSort,
  closeNotificationTemplateForm,
  deleteNotificationTemplate,
  filterNotificationTemplates,
  getNotificationTemplates,
  getNotificationTemplate,
  selectNotificationTemplate,
  openNotificationTemplateForm,
  paginateNotificationTemplates,
  postNotificationTemplate,
  putNotificationTemplate,
  refreshNotificationTemplates,
  searchNotificationTemplates,
  setNotificationTemplateSchema,
  sortNotificationTemplates,
} = stakeholderActions;
