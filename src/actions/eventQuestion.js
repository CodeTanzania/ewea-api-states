import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventQuestionActions = generateExposedActions(
  'eventQuestion',
  actions,
  dispatch
);

export const {
  clearEventQuestionFilters,
  clearEventQuestionsSort,
  closeEventQuestionForm,
  deleteEventQuestion,
  filterEventQuestions,
  getEventQuestions,
  getEventQuestion,
  selectEventQuestion,
  openEventQuestionForm,
  paginateEventQuestions,
  postEventQuestion,
  putEventQuestion,
  refreshEventQuestions,
  searchEventQuestions,
  setEventQuestionSchema,
  sortEventQuestions,
} = eventQuestionActions;
