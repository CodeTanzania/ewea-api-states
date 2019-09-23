import {
  closePlanForm,
  getPlan,
  getPlans,
  openPlanForm,
  postPlan,
  putPlan,
  selectPlan,
  setPlanSchema,
} from '../../src/actions/plan';

describe('Plan Actions', () => {
  it('should expose plan actions', () => {
    expect(typeof selectPlan).toBe('function');
    expect(typeof getPlans).toBe('function');
    expect(typeof getPlan).toBe('function');
    expect(typeof postPlan).toBe('function');
    expect(typeof putPlan).toBe('function');
    expect(typeof setPlanSchema).toBe('function');
    expect(typeof openPlanForm).toBe('function');
    expect(typeof closePlanForm).toBe('function');
  });
});
