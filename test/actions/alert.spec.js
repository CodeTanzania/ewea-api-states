import {
  closeAlertForm,
  getAlert,
  getAlerts,
  openAlertForm,
  postAlert,
  putAlert,
  selectAlert,
  setAlertSchema,
} from '../../src/actions/alert';

describe('Alert Actions', () => {
  it('should expose plan actions', () => {
    expect(typeof selectAlert).toBe('function');
    expect(typeof getAlerts).toBe('function');
    expect(typeof getAlert).toBe('function');
    expect(typeof postAlert).toBe('function');
    expect(typeof putAlert).toBe('function');
    expect(typeof setAlertSchema).toBe('function');
    expect(typeof openAlertForm).toBe('function');
    expect(typeof closeAlertForm).toBe('function');
  });
});
