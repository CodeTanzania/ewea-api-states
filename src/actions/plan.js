import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const planActions = generateExposedActions('plan', actions, dispatch);

export const {
  clearPlanFilters,
  clearPlansSort,
  closePlanForm,
  deletePlan,
  filterPlans,
  getPlans,
  getPlan,
  selectPlan,
  openPlanForm,
  paginatePlans,
  postPlan,
  putPlan,
  refreshPlans,
  searchPlans,
  setPlanSchema,
  sortPlans,
} = planActions;
