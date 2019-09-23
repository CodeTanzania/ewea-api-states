import {
  closeActivityForm,
  getActivities,
  getActivity,
  openActivityForm,
  postActivity,
  putActivity,
  selectActivity,
  setActivitySchema,
} from '../../src/actions/activity';

describe('Activity Actions', () => {
  it('should expose plan actions', () => {
    expect(typeof selectActivity).toBe('function');
    expect(typeof getActivities).toBe('function');
    expect(typeof getActivity).toBe('function');
    expect(typeof postActivity).toBe('function');
    expect(typeof putActivity).toBe('function');
    expect(typeof setActivitySchema).toBe('function');
    expect(typeof openActivityForm).toBe('function');
    expect(typeof closeActivityForm).toBe('function');
  });
});
