import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const partyRoleActions = generateExposedActions('partyRole', actions, dispatch);

export const {
  clearPartyRoleFilters,
  clearPartyRolesSort,
  closePartyRoleForm,
  deletePartyRole,
  filterPartyRoles,
  getPartyRoles,
  getPartyRole,
  selectPartyRole,
  openPartyRoleForm,
  paginatePartyRoles,
  postPartyRole,
  putPartyRole,
  refreshPartyRoles,
  searchPartyRoles,
  setPartyRoleSchema,
  sortPartyRoles,
  loadMorePartyRoles,
} = partyRoleActions;
