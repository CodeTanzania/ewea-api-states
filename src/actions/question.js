import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const questionActions = generateExposedActions('question', actions, dispatch);

export const {
  clearQuestionFilters,
  clearQuestionsSort,
  closeQuestionForm,
  deleteQuestion,
  filterQuestions,
  getQuestions,
  getQuestion,
  selectQuestion,
  openQuestionForm,
  paginateQuestions,
  postQuestion,
  putQuestion,
  refreshQuestions,
  searchQuestions,
  setQuestionSchema,
  sortQuestions,
} = questionActions;
