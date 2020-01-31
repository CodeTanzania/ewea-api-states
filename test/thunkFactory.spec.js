import { httpActions } from '@codetanzania/ewea-api-client';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import createThunkFor from '../src/factories/thunk';

const {
  deleteFocalPerson,
  getFocalPerson,
  getFocalPeople,
  postFocalPerson,
  putFocalPerson,
} = httpActions;
jest.mock('@codetanzania/ewea-api-client');
const mockStore = configureMockStore([thunk]);

describe('Thunk Factory', () => {
  it('should create object which expose common thunks', () => {
    const thunks = createThunkFor('focalPeople');

    expect(typeof thunks.getFocalPeople).toBe('function');
    expect(typeof thunks.getFocalPerson).toBe('function');
    expect(typeof thunks.postFocalPerson).toBe('function');
    expect(typeof thunks.putFocalPerson).toBe('function');
  });

  it('should dispatch required actions when get resources succeed', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockResolvedValueOnce(mockData);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    return store
      .dispatch(focalPersonThunks.getFocalPeople({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when get resources fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockRejectedValueOnce(error);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleFailure', payload: error },
    ];

    return store
      .dispatch(focalPersonThunks.getFocalPeople({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when refresh resources succeed', () => {
    const store = mockStore({
      focalPeople: {
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
    getFocalPeople.mockResolvedValueOnce(mockData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.refreshFocalPeople(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalled();
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when refresh resources fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.refreshFocalPeople(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when filter resources succeed', () => {
    const store = mockStore({
      focalPeople: {
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
    getFocalPeople.mockResolvedValueOnce(mockData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/filterFocalPeople', payload: { name: 'Test' } },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(
        focalPersonThunks.filterFocalPeople(
          { name: 'Test' },
          onSuccess,
          onError
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when filter resources fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/filterFocalPeople', payload: { name: 'Test' } },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(
        focalPersonThunks.filterFocalPeople(
          { name: 'Test' },
          onSuccess,
          onError
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should reload resources when clear resource filters succeed', () => {
    const store = mockStore({
      focalPeople: {
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
    getFocalPeople.mockResolvedValueOnce(mockData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/filterFocalPeople', payload: null },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.clearFocalPersonFilters(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should reload resources when clearing part of filters succeed', () => {
    const store = mockStore({
      focalPeople: {
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
    getFocalPeople.mockResolvedValueOnce(mockData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/filterFocalPeople', payload: { name: 'Test' } },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(
        focalPersonThunks.clearFocalPersonFilters(onSuccess, onError, ['name'])
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch error action when clear filters fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/filterFocalPeople', payload: null },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.clearFocalPersonFilters(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should reload resources when clear resource sort succeed', () => {
    const store = mockStore({
      focalPeople: {
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
    getFocalPeople.mockResolvedValueOnce(mockData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/clearFocalPeopleSort', payload: undefined },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.clearFocalPeopleSort(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getFocalPeople).toHaveBeenCalledWith({ page: 1 });
      });
  });

  it('should dispatch error action when clear resource sort fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/clearFocalPeopleSort', payload: undefined },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.clearFocalPeopleSort(onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(getFocalPeople).toHaveBeenCalledWith({ page: 1 });
      });
  });

  it('should dispatch required actions when search resources succeed', () => {
    const store = mockStore({
      focalPeople: {
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
    getFocalPeople.mockResolvedValueOnce(mockData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/searchFocalPeople', payload: 'Test' },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.searchFocalPeople('Test', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when search resources fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');

    const expectedActions = [
      { type: 'focalPerson/searchFocalPeople', payload: 'Test' },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.searchFocalPeople('Test', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when sort resources succeed', () => {
    const store = mockStore({
      focalPeople: {
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
    getFocalPeople.mockResolvedValueOnce(mockData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/sortFocalPeople', payload: { name: -1 } },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(
        focalPersonThunks.sortFocalPeople({ name: -1 }, onSuccess, onError)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getFocalPeople).toHaveBeenCalledWith({
          page: 1,
          sort: { name: -1 },
        });
      });
  });

  it('should dispatch required actions when sort resources fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/sortFocalPeople', payload: { name: -1 } },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(
        focalPersonThunks.sortFocalPeople({ name: -1 }, onSuccess, onError)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(getFocalPeople).toHaveBeenCalledWith({
          page: 1,
          sort: { name: -1 },
        });
      });
  });

  it('should dispatch required actions when paginate resources succeed', () => {
    const store = mockStore({
      focalPeople: {
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
    getFocalPeople.mockResolvedValueOnce(mockData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockData },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.paginateFocalPeople(1, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getFocalPeople).toHaveBeenCalledWith({ page: 1, filter: {} });
      });
  });

  it('should dispatch required actions when paginate resources fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPeople.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.paginateFocalPeople(1, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when get a resource succeed', () => {
    const store = mockStore({
      focalPeople: {
        list: [],
      },
    });

    const mockData = {
      name: 'Finish off',
    };

    getFocalPerson.mockResolvedValueOnce(mockData);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/getFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/getFocalPersonSuccess', payload: mockData },
    ];

    return store
      .dispatch(focalPersonThunks.getFocalPerson('id', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when get a resource fails', () => {
    const store = mockStore({
      focalPeople: {
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

    getFocalPerson.mockRejectedValueOnce(error);
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/getFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/getFocalPersonFailure', payload: error },
    ];

    return store
      .dispatch(focalPersonThunks.getFocalPerson({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when post a resource succeed', () => {
    const store = mockStore({
      focalPeople: {
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

    postFocalPerson.mockResolvedValueOnce(mockData);
    getFocalPeople.mockResolvedValueOnce(mockGetData);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/postFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/postFocalPersonSuccess', payload: mockData },
      { type: 'focalPerson/clearFocalPeopleFilters', payload: undefined },
      { type: 'focalPerson/clearFocalPeopleSort', payload: undefined },
      { type: 'focalPerson/searchFocalPeople', payload: undefined },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(focalPersonThunks.postFocalPerson({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch actions on post resource with filter option', () => {
    const store = mockStore({
      focalPeople: {
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

    postFocalPerson.mockResolvedValueOnce(mockData);
    getFocalPeople.mockResolvedValueOnce(mockGetData);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/postFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/postFocalPersonSuccess', payload: mockData },
      { type: 'focalPerson/clearFocalPeopleFilters', payload: undefined },
      { type: 'focalPerson/clearFocalPeopleSort', payload: undefined },
      { type: 'focalPerson/searchFocalPeople', payload: undefined },
      { type: 'focalPerson/filterFocalPeople', payload: { test: 1 } },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(
        focalPersonThunks.postFocalPerson({}, onSuccess, onError, {
          filters: { test: 1 },
        })
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(getFocalPeople).toHaveBeenCalled();
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch actions on post resource with no filter option', () => {
    const store = mockStore({
      focalPeople: {
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

    postFocalPerson.mockResolvedValueOnce(mockData);
    getFocalPeople.mockResolvedValueOnce(mockGetData);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/postFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/postFocalPersonSuccess', payload: mockData },
      { type: 'focalPerson/clearFocalPeopleFilters', payload: undefined },
      { type: 'focalPerson/clearFocalPeopleSort', payload: undefined },
      { type: 'focalPerson/searchFocalPeople', payload: undefined },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(
        focalPersonThunks.postFocalPerson({}, onSuccess, onError, {
          sort: { test: 1 },
        })
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(getFocalPeople).toHaveBeenCalled();
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when post a resource fails', () => {
    const store = mockStore({
      focalPeople: {
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

    postFocalPerson.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/postFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/postFocalPersonFailure', payload: error },
    ];

    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.postFocalPerson({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when put a resource succeed', () => {
    const store = mockStore({
      focalPeople: {
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

    putFocalPerson.mockResolvedValueOnce(mockData);
    getFocalPeople.mockResolvedValueOnce(mockGetData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/putFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/putFocalPersonSuccess', payload: mockData },
      { type: 'focalPerson/clearFocalPeopleFilters', payload: undefined },
      { type: 'focalPerson/clearFocalPeopleSort', payload: undefined },
      { type: 'focalPerson/searchFocalPeople', payload: undefined },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(focalPersonThunks.putFocalPerson({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
      });
  });

  it('should dispatch required actions when put a resource fails', () => {
    const store = mockStore({
      focalPeople: {
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

    putFocalPerson.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/putFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/putFocalPersonFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.putFocalPerson({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });

  it('should dispatch required actions when delete resource succeed', () => {
    const store = mockStore({
      focalPeople: {
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

    deleteFocalPerson.mockResolvedValueOnce(mockData);
    getFocalPeople.mockResolvedValueOnce(mockGetData);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/deleteFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/deleteFocalPersonSuccess', payload: mockData },
      { type: 'focalPerson/getFocalPeopleRequest', payload: undefined },
      { type: 'focalPerson/getFocalPeopleSuccess', payload: mockGetData },
    ];

    return store
      .dispatch(focalPersonThunks.deleteFocalPerson('id', onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledTimes(0);
        expect(getFocalPeople).toHaveBeenCalledWith({
          page: 1,
          filter: null,
        });
      });
  });

  it('should dispatch required actions when delete resource fails', () => {
    const store = mockStore({
      focalPeople: {
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

    deleteFocalPerson.mockRejectedValueOnce(error);

    const focalPersonThunks = createThunkFor('focalPeople');
    const expectedActions = [
      { type: 'focalPerson/deleteFocalPersonRequest', payload: undefined },
      { type: 'focalPerson/deleteFocalPersonFailure', payload: error },
    ];
    const onSuccess = jest.fn();
    const onError = jest.fn();

    return store
      .dispatch(focalPersonThunks.deleteFocalPerson({}, onSuccess, onError))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(onSuccess).toHaveBeenCalledTimes(0);
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(error);
      });
  });
});
