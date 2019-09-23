import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const stakeholderActions = generateExposedActions('agency', actions, dispatch);

export const {
  clearAgencyFilters,
  clearAgenciesSort,
  closeAgencyForm,
  deleteAgency,
  filterAgencies,
  getAgencies,
  getAgency,
  selectAgency,
  openAgencyForm,
  paginateAgencies,
  postAgency,
  putAgency,
  refreshAgencies,
  searchAgencies,
  setAgencySchema,
  sortAgencies,
} = stakeholderActions;
