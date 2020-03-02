import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const eventTopicActions = generateExposedActions(
  'eventTopic',
  actions,
  dispatch
);

export const {
  clearEventTopicFilters,
  clearEventTopicsSort,
  closeEventTopicForm,
  deleteEventTopic,
  filterEventTopics,
  getEventTopics,
  getEventTopic,
  selectEventTopic,
  openEventTopicForm,
  paginateEventTopics,
  postEventTopic,
  putEventTopic,
  refreshEventTopics,
  searchEventTopics,
  setEventTopicSchema,
  sortEventTopics,
  loadMoreEventTopics,
} = eventTopicActions;
