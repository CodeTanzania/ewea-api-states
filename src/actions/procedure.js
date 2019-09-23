import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const procedureActions = generateExposedActions('procedure', actions, dispatch);

export const {
  clearProcedureFilters,
  clearProceduresSort,
  closeProcedureForm,
  deleteProcedure,
  filterProcedures,
  getProcedures,
  getProcedure,
  selectProcedure,
  openProcedureForm,
  paginateProcedures,
  postProcedure,
  putProcedure,
  refreshProcedures,
  searchProcedures,
  setProcedureSchema,
  sortProcedures,
} = procedureActions;
