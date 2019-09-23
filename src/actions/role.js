import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const roleActions = generateExposedActions('role', actions, dispatch);

export const {
  clearRoleFilters,
  clearRolesSort,
  closeRoleForm,
  deleteRole,
  filterRoles,
  getRoles,
  getRole,
  selectRole,
  openRoleForm,
  paginateRoles,
  postRole,
  putRole,
  refreshRoles,
  searchRoles,
  setRoleSchema,
  sortRoles,
} = roleActions;
