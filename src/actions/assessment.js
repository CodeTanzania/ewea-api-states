import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const assessmentActions = generateExposedActions(
  'assessment',
  actions,
  dispatch
);

export const {
  clearAssessmentFilters,
  clearAssessmentsSort,
  closeAssessmentForm,
  deleteAssessment,
  filterAssessments,
  getAssessments,
  getAssessment,
  selectAssessment,
  openAssessmentForm,
  paginateAssessments,
  postAssessment,
  putAssessment,
  refreshAssessments,
  searchAssessments,
  setAssessmentSchema,
  sortAssessments,
} = assessmentActions;
