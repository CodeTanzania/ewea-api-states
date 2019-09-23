import { httpActions } from '@codetanzania/emis-api-client';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import createThunkFor from '../src/factories/thunk';

const { deletePlan, getPlan, getPlans, postPlan, putPlan } = httpActions;
jest.mock('@codetanzania/emis-api-client');
const mockStore = configureMockStore([thunk]);

describe('Thunk Factory', () => {
  it('should create object which expose common thunks', () => {
    const thunks = createThunkFor('incidentType');

    expect(typeof thunks.getIncidentTypes).toBe('function');
    expect(typeof thunks.getIncidentType).toBe('function');
    expect(typeof thunks.postIncidentType).toBe('function');
    expect(typeof thunks.putIncidentType).toBe('function');
  });

  it('should dispatch required actions when get resources succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };

    getPlans.mockResolvedValueOnce(mockData);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    return store
      .dispatch(planThunks.getPlans({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when get resources fails', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlans.mockRejectedValueOnce(error);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansFailure', payload: error },
    ];

    return store
      .dispatch(planThunks.getPlans({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when refresh resources succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
        filter: { name: 'Test' },
        page: 1,
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };
    getPlans.mockResolvedValueOnce(mockData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.refreshPlans(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalled();
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when refresh resources fails', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlans.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.refreshPlans(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when filter resources succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
        page: 1,
        filter: {},
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };
    getPlans.mockResolvedValueOnce(mockData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/filterPlans', payload: { name: 'Test' } },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.filterPlans({ name: 'Test' }, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when filter resources fails', () => {
    const store = mockStore({
      plans: {
        list: [],
        error: null,
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlans.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/filterPlans', payload: { name: 'Test' } },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.filterPlans({ name: 'Test' }, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should reload resources when clear resource filters succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };
    getPlans.mockResolvedValueOnce(mockData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/filterPlans', payload: null },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.clearPlanFilters(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should reload resources when clearing part of filters succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
        filter: { name: 'Test', age: 12 },
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };
    getPlans.mockResolvedValueOnce(mockData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/filterPlans', payload: { name: 'Test' } },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.clearPlanFilters(onSuccess, onError, ['name']))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch error action when clear filters fails', () => {
    const store = mockStore({
      plans: {
        list: [],
        error: null,
        filter: { name: 'Test' },
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlans.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/filterPlans', payload: null },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.clearPlanFilters(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should reload resources when clear resource sort succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
        page: 1,
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };
    getPlans.mockResolvedValueOnce(mockData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/clearPlansSort', payload: undefined },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.clearPlansSort(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getPlans).toHaveBeenCalledWith({ page: 1 });
      });
  });

  it('should dispatch error action when clear resource sort fails', () => {
    const store = mockStore({
      plans: {
        list: [],
        error: null,
        page: 1,
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlans.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/clearPlansSort', payload: undefined },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.clearPlansSort(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(getPlans).toHaveBeenCalledWith({ page: 1 });
      });
  });

  it('should dispatch required actions when search resources succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
        q: undefined,
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };
    getPlans.mockResolvedValueOnce(mockData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/searchPlans', payload: 'Test' },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.searchPlans('Test', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when search resources fails', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlans.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/searchPlans', payload: 'Test' },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.searchPlans('Test', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when sort resources succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
        page: 1,
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };
    getPlans.mockResolvedValueOnce(mockData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/sortPlans', payload: { name: -1 } },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.sortPlans({ name: -1 }, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getPlans).toHaveBeenCalledWith({ page: 1, sort: { name: -1 } });
      });
  });

  it('should dispatch required actions when sort resources fails', () => {
    const store = mockStore({
      plans: {
        list: [],
        page: 1,
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlans.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/sortPlans', payload: { name: -1 } },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.sortPlans({ name: -1 }, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(getPlans).toHaveBeenCalledWith({ page: 1, sort: { name: -1 } });
      });
  });

  it('should dispatch required actions when paginate resources succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
        filter: {},
      },
    });

    const mockData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };
    getPlans.mockResolvedValueOnce(mockData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.paginatePlans(1, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getPlans).toHaveBeenCalledWith({ page: 1, filter: {} });
      });
  });

  it('should dispatch required actions when paginate resources fails', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlans.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.paginatePlans(1, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when get a resource succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const mockData = {
      name: 'Finish off',
    };

    getPlan.mockResolvedValueOnce(mockData);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/getPlanRequest', payload: undefined },
      { type: 'plan/getPlanSuccess', payload: mockData },
    ];

    return store
      .dispatch(planThunks.getPlan('id', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when get a resource fails', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });
    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    getPlan.mockRejectedValueOnce(error);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/getPlanRequest', payload: undefined },
      { type: 'plan/getPlanFailure', payload: error },
    ];

    return store
      .dispatch(planThunks.getPlan({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when post a resource succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const mockData = {
      data: {
        name: 'Finish off',
      },
    };

    const mockGetData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };

    postPlan.mockResolvedValueOnce(mockData);
    getPlans.mockResolvedValueOnce(mockGetData);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/postPlanRequest', payload: undefined },
      { type: 'plan/postPlanSuccess', payload: mockData },
      { type: 'plan/clearPlansFilters', payload: undefined },
      { type: 'plan/clearPlansSort', payload: undefined },
      { type: 'plan/searchPlans', payload: undefined },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(planThunks.postPlan({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when post a resource fails', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    postPlan.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/postPlanRequest', payload: undefined },
      { type: 'plan/postPlanFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.postPlan({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when put a resource succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const mockData = {
      name: 'Finish off',
    };

    const mockGetData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };

    const onSuccess = jest.fn();
    const onError = jest.fn();

    putPlan.mockResolvedValueOnce(mockData);
    getPlans.mockResolvedValueOnce(mockGetData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/putPlanRequest', payload: undefined },
      { type: 'plan/putPlanSuccess', payload: mockData },
      { type: 'plan/clearPlansFilters', payload: undefined },
      { type: 'plan/clearPlansSort', payload: undefined },
      { type: 'plan/searchPlans', payload: undefined },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(planThunks.putPlan({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when put a resource fails', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    putPlan.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/putPlanRequest', payload: undefined },
      { type: 'plan/putPlanFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.putPlan({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when delete resource succeed', () => {
    const store = mockStore({
      plans: {
        list: [],
        page: 1,
        filter: null,
      },
    });

    const mockData = {
      name: 'Finish off',
    };

    const mockGetData = {
      data: {
        data: [{ name: 'Finish off' }],
        page: 1,
        pages: 1,
        total: 1,
      },
    };

    const onSuccess = jest.fn();
    const onError = jest.fn();

    deletePlan.mockResolvedValueOnce(mockData);
    getPlans.mockResolvedValueOnce(mockGetData);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/deletePlanRequest', payload: undefined },
      { type: 'plan/deletePlanSuccess', payload: mockData },
      { type: 'plan/getPlansRequest', payload: undefined },
      { type: 'plan/getPlansSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(planThunks.deletePlan('id', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getPlans).toHaveBeenCalledWith({
          page: 1,
          filter: null,
        });
      });
  });

  it('should dispatch required actions when delete resource fails', () => {
    const store = mockStore({
      plans: {
        list: [],
      },
    });

    const error = {
      status: 404,
      code: 404,
      name: 'Error',
      message: 'Not Found',
      developerMessage: 'Not Found',
      userMessage: 'Not Found',
      error: 'Error',
      error_description: 'Not Found',
    };

    deletePlan.mockRejectedValueOnce(error);

    const planThunks = createThunkFor('plans');
    const expectedActions = [
      { type: 'plan/deletePlanRequest', payload: undefined },
      { type: 'plan/deletePlanFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(planThunks.deletePlan({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });
});
