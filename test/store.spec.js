import {
  app,
  INITIALIZE_APP_FAILURE,
  INITIALIZE_APP_START,
  INITIALIZE_APP_SUCCESS,
  SIGNIN_APP_FAILURE,
  SIGNIN_APP_START,
  SIGNIN_APP_SUCCESS,
  SIGNOUT,
} from '../src/store';

describe('App reducer', () => {
  const defaultState = {
    loading: false,
    signing: false,
    error: null,
    party: null,
  };

  it('should return default state when action is invalid', () => {
    const action = { type: 'app/test', payload: {} };
    expect(app(undefined, action)).toEqual(defaultState);
  });

  it(`should handle action of type ${INITIALIZE_APP_START}`, () => {
    const action = { type: INITIALIZE_APP_START };

    expect(app(undefined, action)).toEqual({ ...defaultState, loading: true });
  });

  it(`should handle action of type ${INITIALIZE_APP_SUCCESS}`, () => {
    const action = { type: INITIALIZE_APP_SUCCESS };

    expect(app(undefined, action)).toEqual({ ...defaultState, loading: false });
  });

  it(`should handle action of type ${INITIALIZE_APP_FAILURE}`, () => {
    const error = new Error();
    const action = { type: INITIALIZE_APP_FAILURE, payload: error };
    const previousState = { ...defaultState, loading: true };

    expect(app(previousState, action)).toEqual({
      ...defaultState,
      loading: false,
      error,
    });
  });

  it(`should handle action of type ${SIGNIN_APP_START}`, () => {
    const action = { type: SIGNIN_APP_START };

    expect(app(defaultState, action)).toEqual({
      ...defaultState,
      signing: true,
    });
  });

  it(`should handle action of type ${SIGNIN_APP_SUCCESS}`, () => {
    const action = { type: SIGNIN_APP_SUCCESS, payload: {} };
    const previousState = { ...defaultState, signing: true };

    expect(app(previousState, action)).toEqual({
      ...defaultState,
      party: action.payload,
      signing: false,
    });
  });

  it(`should handle action of type ${SIGNIN_APP_FAILURE}`, () => {
    const error = new Error();
    const action = { type: SIGNIN_APP_FAILURE, payload: error };

    expect(app(defaultState, action)).toEqual({ ...defaultState, error });
  });

  it(`should handle action of type ${SIGNOUT}`, () => {
    const previousState = { ...defaultState, party: { name: 'test' } };

    const action = { type: SIGNOUT };

    expect(app(previousState, action)).toEqual({
      ...defaultState,
      party: null,
    });
  });
});
