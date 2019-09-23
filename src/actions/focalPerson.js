import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const stakeholderActions = generateExposedActions(
  'focalPerson',
  actions,
  dispatch
);

export const {
  clearFocalPersonFilters,
  clearFocalPeopleSort,
  closeFocalPersonForm,
  deleteFocalPerson,
  filterFocalPeople,
  getFocalPeople,
  getFocalPerson,
  selectFocalPerson,
  openFocalPersonForm,
  paginateFocalPeople,
  postFocalPerson,
  putFocalPerson,
  refreshFocalPeople,
  searchFocalPeople,
  setFocalPersonSchema,
  sortFocalPeople,
} = stakeholderActions;
