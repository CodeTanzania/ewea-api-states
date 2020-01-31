import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const changelogActions = generateExposedActions('changelog', actions, dispatch);

export const {
  clearChangelogFilters,
  clearChangelogsSort,
  closeChangelogForm,
  deleteChangelog,
  filterChangelogs,
  getChangelogs,
  getChangelog,
  selectChangelog,
  openChangelogForm,
  paginateChangelogs,
  postChangelog,
  putChangelog,
  refreshChangelogs,
  searchChangelogs,
  setChangelogSchema,
  sortChangelogs,
  loadMoreChangelogs,
} = changelogActions;
