import { httpActions } from '@codetanzania/ewea-api-client';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import createThunkFor from '../src/factories/thunk';

const { deleteAlert, getAlert, getAlerts, postAlert, putAlert } = httpActions;
jest.mock('@codetanzania/ewea-api-client');
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
      alerts: {
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

    getAlerts.mockResolvedValueOnce(mockData);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    return store
      .dispatch(alertThunks.getAlerts({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when get resources fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlerts.mockRejectedValueOnce(error);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsFailure', payload: error },
    ];

    return store
      .dispatch(alertThunks.getAlerts({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when refresh resources succeed', () => {
    const store = mockStore({
      alerts: {
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
    getAlerts.mockResolvedValueOnce(mockData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.refreshAlerts(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalled();
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when refresh resources fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlerts.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.refreshAlerts(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when filter resources succeed', () => {
    const store = mockStore({
      alerts: {
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
    getAlerts.mockResolvedValueOnce(mockData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/filterAlerts', payload: { name: 'Test' } },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.filterAlerts({ name: 'Test' }, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when filter resources fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlerts.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/filterAlerts', payload: { name: 'Test' } },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.filterAlerts({ name: 'Test' }, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should reload resources when clear resource filters succeed', () => {
    const store = mockStore({
      alerts: {
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
    getAlerts.mockResolvedValueOnce(mockData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/filterAlerts', payload: null },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.clearAlertFilters(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should reload resources when clearing part of filters succeed', () => {
    const store = mockStore({
      alerts: {
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
    getAlerts.mockResolvedValueOnce(mockData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/filterAlerts', payload: { name: 'Test' } },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.clearAlertFilters(onSuccess, onError, ['name']))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch error action when clear filters fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlerts.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/filterAlerts', payload: null },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.clearAlertFilters(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should reload resources when clear resource sort succeed', () => {
    const store = mockStore({
      alerts: {
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
    getAlerts.mockResolvedValueOnce(mockData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/clearAlertsSort', payload: undefined },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.clearAlertsSort(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getAlerts).toHaveBeenCalledWith({ page: 1 });
      });
  });

  it('should dispatch error action when clear resource sort fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlerts.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/clearAlertsSort', payload: undefined },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.clearAlertsSort(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(getAlerts).toHaveBeenCalledWith({ page: 1 });
      });
  });

  it('should dispatch required actions when search resources succeed', () => {
    const store = mockStore({
      alerts: {
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
    getAlerts.mockResolvedValueOnce(mockData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/searchAlerts', payload: 'Test' },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.searchAlerts('Test', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when search resources fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlerts.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/searchAlerts', payload: 'Test' },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.searchAlerts('Test', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when sort resources succeed', () => {
    const store = mockStore({
      alerts: {
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
    getAlerts.mockResolvedValueOnce(mockData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/sortAlerts', payload: { name: -1 } },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.sortAlerts({ name: -1 }, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getAlerts).toHaveBeenCalledWith({ page: 1, sort: { name: -1 } });
      });
  });

  it('should dispatch required actions when sort resources fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlerts.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/sortAlerts', payload: { name: -1 } },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.sortAlerts({ name: -1 }, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(getAlerts).toHaveBeenCalledWith({ page: 1, sort: { name: -1 } });
      });
  });

  it('should dispatch required actions when paginate resources succeed', () => {
    const store = mockStore({
      alerts: {
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
    getAlerts.mockResolvedValueOnce(mockData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.paginateAlerts(1, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getAlerts).toHaveBeenCalledWith({ page: 1, filter: {} });
      });
  });

  it('should dispatch required actions when paginate resources fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlerts.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.paginateAlerts(1, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when get a resource succeed', () => {
    const store = mockStore({
      alerts: {
        list: [],
      },
    });

    const mockData = {
      name: 'Finish off',
    };

    getAlert.mockResolvedValueOnce(mockData);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/getAlertRequest', payload: undefined },
      { type: 'alert/getAlertSuccess', payload: mockData },
    ];

    return store
      .dispatch(alertThunks.getAlert('id', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when get a resource fails', () => {
    const store = mockStore({
      alerts: {
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

    getAlert.mockRejectedValueOnce(error);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/getAlertRequest', payload: undefined },
      { type: 'alert/getAlertFailure', payload: error },
    ];

    return store
      .dispatch(alertThunks.getAlert({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when post a resource succeed', () => {
    const store = mockStore({
      alerts: {
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

    postAlert.mockResolvedValueOnce(mockData);
    getAlerts.mockResolvedValueOnce(mockGetData);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/postAlertRequest', payload: undefined },
      { type: 'alert/postAlertSuccess', payload: mockData },
      { type: 'alert/clearAlertsFilters', payload: undefined },
      { type: 'alert/clearAlertsSort', payload: undefined },
      { type: 'alert/searchAlerts', payload: undefined },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(alertThunks.postAlert({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when post a resource fails', () => {
    const store = mockStore({
      alerts: {
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

    postAlert.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/postAlertRequest', payload: undefined },
      { type: 'alert/postAlertFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.postAlert({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when put a resource succeed', () => {
    const store = mockStore({
      alerts: {
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

    putAlert.mockResolvedValueOnce(mockData);
    getAlerts.mockResolvedValueOnce(mockGetData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/putAlertRequest', payload: undefined },
      { type: 'alert/putAlertSuccess', payload: mockData },
      { type: 'alert/clearAlertsFilters', payload: undefined },
      { type: 'alert/clearAlertsSort', payload: undefined },
      { type: 'alert/searchAlerts', payload: undefined },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(alertThunks.putAlert({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when put a resource fails', () => {
    const store = mockStore({
      alerts: {
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

    putAlert.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/putAlertRequest', payload: undefined },
      { type: 'alert/putAlertFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.putAlert({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when delete resource succeed', () => {
    const store = mockStore({
      alerts: {
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

    deleteAlert.mockResolvedValueOnce(mockData);
    getAlerts.mockResolvedValueOnce(mockGetData);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/deleteAlertRequest', payload: undefined },
      { type: 'alert/deleteAlertSuccess', payload: mockData },
      { type: 'alert/getAlertsRequest', payload: undefined },
      { type: 'alert/getAlertsSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(alertThunks.deleteAlert('id', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getAlerts).toHaveBeenCalledWith({
          page: 1,
          filter: null,
        });
      });
  });

  it('should dispatch required actions when delete resource fails', () => {
    const store = mockStore({
      alerts: {
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

    deleteAlert.mockRejectedValueOnce(error);

    const alertThunks = createThunkFor('alerts');
    const expectedActions = [
      { type: 'alert/deleteAlertRequest', payload: undefined },
      { type: 'alert/deleteAlertFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(alertThunks.deleteAlert({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });
});
