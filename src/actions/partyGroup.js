import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const partyGroupActions = generateExposedActions(
  'partyGroup',
  actions,
  dispatch
);

export const {
  clearPartyGroupFilters,
  clearPartyGroupsSort,
  closePartyGroupForm,
  deletePartyGroup,
  filterPartyGroups,
  getPartyGroups,
  getPartyGroup,
  selectPartyGroup,
  openPartyGroupForm,
  paginatePartyGroups,
  postPartyGroup,
  putPartyGroup,
  refreshPartyGroups,
  searchPartyGroups,
  setPartyGroupSchema,
  sortPartyGroups,
  loadMorePartyGroups,
} = partyGroupActions;
