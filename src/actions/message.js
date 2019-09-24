import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const messageActions = generateExposedActions('message', actions, dispatch);

export const {
  clearMessageFilters,
  clearMessagesSort,
  closeMessageForm,
  deleteMessage,
  filterMessages,
  getMessages,
  getMessage,
  selectMessage,
  openMessageForm,
  paginateMessages,
  postMessage,
  putMessage,
  refreshMessages,
  searchMessages,
  setMessageSchema,
  sortMessages,
} = messageActions;
