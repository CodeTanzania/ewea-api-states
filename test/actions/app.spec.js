import { httpActions, signIn } from '@codetanzania/ewea-api-client';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  initializeApp,
  initializeAppFailure,
  initializeAppStart,
  initializeAppSuccess,
  signInStart,
  signInSuccess,
  signInFailure,
  signIn as signInThunk,
  signOut as signOutAction,
} from '../../src/actions/app';
import {
  INITIALIZE_APP_FAILURE,
  INITIALIZE_APP_START,
  INITIALIZE_APP_SUCCESS,
  SIGNIN_APP_START,
  SIGNIN_APP_SUCCESS,
  SIGNIN_APP_FAILURE,
  SIGNOUT,
} from '../../src/store';

const { getSchemas } = httpActions;
jest.mock('@codetanzania/ewea-api-client');
const mockStore = configureMockStore([thunk]);

describe('App Actions', () => {
  describe('Actions', () => {
    it(`should create action of type ${INITIALIZE_APP_START}`, () => {
      expect(initializeAppStart()).toEqual({ type: INITIALIZE_APP_START });
    });

    it(`should create action of type ${INITIALIZE_APP_SUCCESS}`, () => {
      expect(initializeAppSuccess()).toEqual({ type: INITIALIZE_APP_SUCCESS });
    });

    it(`should create action of type ${INITIALIZE_APP_FAILURE}`, () => {
      expect(initializeAppFailure({})).toEqual({
        type: INITIALIZE_APP_FAILURE,
        payload: {},
      });
    });

    it(`should create action of type ${SIGNIN_APP_START}`, () => {
      expect(signInStart()).toEqual({ type: SIGNIN_APP_START });
    });

    it(`should create action of type ${SIGNIN_APP_SUCCESS}`, () => {
      expect(signInSuccess({})).toEqual({
        type: SIGNIN_APP_SUCCESS,
        payload: {},
      });
    });

    it(`should create action of type ${SIGNIN_APP_FAILURE}`, () => {
      expect(signInFailure({})).toEqual({
        type: SIGNIN_APP_FAILURE,
        payload: {},
      });
    });

    it(`should create action of type ${SIGNOUT}`, () => {
      expect(signOutAction()).toEqual({
        type: SIGNOUT,
      });
    });
  });

  describe('initializeApp Thunk', () => {
    it('should dispatch all schema actions', () => {
      const store = mockStore({});
      const mockData = {
        Permission: {},
        FocalPerson: {},
        Party: {},
        Agency: {},
        Event: {},
      };

      getSchemas.mockResolvedValueOnce(mockData);

      const expectedActions = [
        { type: 'app/initialize' },
        {
          type: 'agency/setAgencySchema',
          payload: mockData.Agency,
        },
        { type: 'event/setEventSchema', payload: mockData.Event },
        {
          type: 'focalPerson/setFocalPersonSchema',
          payload: mockData.FocalPerson,
        },
        { type: 'app/initializeSuccess' },
      ];

      return store.dispatch(initializeApp()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('Sign In Thunk', () => {
    it('should handle successful signIn action', () => {
      const store = mockStore({});
      const mockData = {
        success: true,
        party: {},
        token: '',
      };
      signIn.mockResolvedValueOnce(mockData);
      const onSuccess = jest.fn();
      const onError = jest.fn();

      const expectedActions = [
        { type: SIGNIN_APP_START },
        {
          type: SIGNIN_APP_SUCCESS,
          payload: { party: mockData.party, permissions: [] },
        },
      ];

      return store
        .dispatch(signInThunk({ email: '', password: '' }, onSuccess, onError))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(onSuccess).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledTimes(0);
        });
    });

    it('should handle failure signIn action', () => {
      const store = mockStore({});

      const mockData = {
        code: 403,
        status: 403,
        name: 'Error',
        message: 'Incorrect email or password',
        description: 'Incorrect email or password',
        error: 'Error',
        error_description: 'Incorrect email or password',
      };

      signIn.mockRejectedValueOnce(mockData);
      const onSuccess = jest.fn();
      const onError = jest.fn();

      const expectedActions = [
        { type: SIGNIN_APP_START },
        { type: SIGNIN_APP_FAILURE, payload: mockData },
      ];

      return store
        .dispatch(signInThunk({ email: '', password: '' }, onSuccess, onError))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(onSuccess).toHaveBeenCalledTimes(0);
          expect(onError).toHaveBeenCalledTimes(1);
          expect(onError).toHaveBeenCalledWith(mockData);
        });
    });
  });
});
