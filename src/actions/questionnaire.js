import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const questionnaireActions = generateExposedActions(
  'questionnaire',
  actions,
  dispatch
);

export const {
  clearQuestionnaireFilters,
  clearQuestionnairesSort,
  closeQuestionnaireForm,
  deleteQuestionnaire,
  filterQuestionnaires,
  getQuestionnaires,
  getQuestionnaire,
  selectQuestionnaire,
  openQuestionnaireForm,
  paginateQuestionnaires,
  postQuestionnaire,
  putQuestionnaire,
  refreshQuestionnaires,
  searchQuestionnaires,
  setQuestionnaireSchema,
  sortQuestionnaires,
} = questionnaireActions;
