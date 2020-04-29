import {
  httpActions,
  signIn as login,
  signOut as logout,
} from '@codetanzania/ewea-api-client';
import { isFunction } from 'lodash';
import {
  actions,
  dispatch as storeDispatch,
  INITIALIZE_APP_FAILURE,
  INITIALIZE_APP_START,
  INITIALIZE_APP_SUCCESS,
  SIGNIN_APP_START,
  SIGNIN_APP_SUCCESS,
  SIGNIN_APP_FAILURE,
  SIGNOUT,
} from '../store';

/* declarations */
const { getSchemas } = httpActions;

/**
 * Action dispatched when application initialization starts
 *
 * @function
 * @name initializeAppStart
 *
 * @returns {object}  Action object
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function initializeAppStart() {
  return { type: INITIALIZE_APP_START };
}

/**
 * Action dispatched when application initialization is successfully
 *
 * @function
 * @name initializeAppSuccess
 *
 *
 * @returns {object}  action Object
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function initializeAppSuccess() {
  return { type: INITIALIZE_APP_SUCCESS };
}

/**
 * Action dispatched when an error occurs during application initialization
 *
 * @function
 * @name initializeAppFailure
 *
 * @param {object} error  error happened during application initialization
 *
 * @returns {object}  Nothing is returned
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function initializeAppFailure(error) {
  return { type: INITIALIZE_APP_FAILURE, payload: error };
}

/**
 * Action dispatched when user start to signIng into the system
 *
 * @function
 * @name signInStart
 *
 * @returns {object}  redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signInStart() {
  return { type: SIGNIN_APP_START };
}

/**
 * Action dispatched when user successfully signed In into the system
 *
 * @function
 * @name signInSuccess
 *
 * @param {object} party  signed In user/party
 * @returns {object}  redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signInSuccess(party) {
  return { type: SIGNIN_APP_SUCCESS, payload: party };
}

/**
 * Action dispatched when user signing In fails
 *
 * @param {object} error  Error instance
 * @returns {object}  redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signInFailure(error) {
  return { type: SIGNIN_APP_FAILURE, payload: error };
}

/**
 * Action dispatched when user signOut
 *
 * @function
 * @name signOut
 *
 * @returns {object}  Redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signOut() {
  return { type: SIGNOUT };
}

/**
 * Action dispatched when application is started. It will load up all schema
 * need for in the application
 *
 * @function
 * @name initializeApp
 *
 * @returns {Function}  thunk function
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function initializeApp() {
  return (dispatch) => {
    dispatch(initializeAppStart());
    return getSchemas()
      .then((schemas) => {
        const {
          agency: { setAgencySchema },
          event: { setEventSchema },
          // alert: { setAlertSchema },
          // district: { setDistrictSchema },
          // feature: { setFeatureSchema },
          focalPerson: { setFocalPersonSchema },
          // indicator: { setIndicatorSchema },
          // incidentType: { setIncidentTypeSchema },
          // question: { setQuestionSchema },
          // questionnaire: { setQuestionnaireSchema },
          // region: { setRegionSchema },
          // role: { setRoleSchema },
        } = actions;

        const {
          Agency: agencySchema,
          Event: eventSchema,
          //   Alert: alertSchema,
          //   District: districtSchema,
          //   Feature: featureSchema,
          FocalPerson: focalPersonSchema,
          //   IncidentType: incidentTypeSchema,
          //   Indicator: indicatorSchema,
          //   Question: questionSchema,
          //   Questionnaire: questionnaireSchema,
          //   Region: regionSchema,
          //   Role: roleSchema,
        } = schemas;

        dispatch(setAgencySchema(agencySchema));
        dispatch(setEventSchema(eventSchema));
        // dispatch(setAlertSchema(alertSchema));
        // dispatch(setDistrictSchema(districtSchema));
        // dispatch(setFeatureSchema(featureSchema));
        dispatch(setFocalPersonSchema(focalPersonSchema));
        // dispatch(setIndicatorSchema(indicatorSchema));
        // dispatch(setIncidentTypeSchema(incidentTypeSchema));
        // dispatch(setQuestionSchema(questionSchema));
        // dispatch(setQuestionnaireSchema(questionnaireSchema));
        // dispatch(setRegionSchema(regionSchema));
        // dispatch(setRoleSchema(roleSchema));
        dispatch(initializeAppSuccess());
      })
      .catch((error) => {
        dispatch(initializeAppFailure(error));
      });
  };
}

/**
 * Thunk action to signIn user/party
 *
 * @function
 * @name signIn
 *
 * @param {object} credentials - Email and password
 * @param {Function} onSuccess - Callback for successfully signIn
 * @param {Function} onError - Callback for failed signIn
 * @returns {Promise} redux thunk
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signIn(credentials, onSuccess, onError) {
  return (dispatch) => {
    dispatch(signInStart());

    return login(credentials)
      .then((results) => {
        const { party } = results;
        dispatch(signInSuccess(party));
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch((error) => {
        dispatch(signInFailure(error));
        if (isFunction(onError)) {
          onError(error);
        }
      });
  };
}

/**
 * Wrapped initialize app thunk
 *
 * @function
 * @name wrappedInitializeApp
 * @returns {Promise} - dispatched initialize app thunk
 *
 * @version 0.1.0
 * @since 0.3.2
 */
export function wrappedInitializeApp() {
  return storeDispatch(initializeApp());
}

/**
 * Wrapped signIng thunk
 *
 * @function
 * @name wrappedSignIn
 *
 * @param {object} credentials - email and password provided by user
 * @param {Function} onSuccess - Callback for successfully signIn
 * @param {Function} onError - Callback for failed signIn
 * @returns {Promise} - dispatched signIng thunk
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function wrappedSignIn(credentials, onSuccess, onError) {
  return storeDispatch(signIn(credentials, onSuccess, onError));
}

/**
 * Wrapped signOut action
 *
 * @function
 * @name wrappedSignOut
 *
 * @returns {undefined}
 *
 * @version 0.2.0
 * @since 0.10.3
 */
export function wrappedSignOut() {
  logout(); // clear sessionStorage
  return storeDispatch(signOut());
}
