import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const incidentTypeActions = generateExposedActions(
  'incidentType',
  actions,
  dispatch
);

export const {
  clearIncidentTypeFilters,
  clearIncidentTypesSort,
  closeIncidentTypeForm,
  deleteIncidentType,
  filterIncidentTypes,
  getIncidentTypes,
  getIncidentType,
  selectIncidentType,
  openIncidentTypeForm,
  paginateIncidentTypes,
  postIncidentType,
  putIncidentType,
  refreshIncidentTypes,
  searchIncidentTypes,
  setIncidentTypeSchema,
  sortIncidentTypes,
} = incidentTypeActions;
