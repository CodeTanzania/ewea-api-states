import {
  httpActions,
  signin as login,
  signout as logout,
} from '@codetanzania/emis-api-client';
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
 * @returns {object} - Action object
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
 * @returns {object} - action Object
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
 * @param {object} error - error happened during application initialization
 *
 * @returns {object} - Nothing is returned
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function initializeAppFailure(error) {
  return { type: INITIALIZE_APP_FAILURE, payload: error };
}

/**
 * Action dispatched when user start to signing into the system
 *
 * @function
 * @name signinStart
 *
 * @returns {object} - redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signinStart() {
  return { type: SIGNIN_APP_START };
}

/**
 * Action dispatched when user successfully signined into the system
 *
 * @function
 * @name signinSuccess
 *
 * @param {object} party - signined user/party
 * @returns {object} - redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signinSuccess(party) {
  return { type: SIGNIN_APP_SUCCESS, payload: party };
}

/**
 * Action dispatched when user signining fails
 *
 * @param {object} error - Error instance
 * @returns {object} - redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signinFailure(error) {
  return { type: SIGNIN_APP_FAILURE, payload: error };
}

/**
 * Action dispatched when user signout
 *
 * @function
 * @name signout
 *
 * @returns {object} - Redux action
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signout() {
  return { type: SIGNOUT };
}

/**
 * Action dispatched when application is started. It will load up all schema
 * need for in the application
 *
 * @function
 * @name initializeApp
 *
 * @returns {Function} - thunk function
 *
 * @version 0.1.0
 * @since 0.1.0
 */
export function initializeApp() {
  return dispatch => {
    dispatch(initializeAppStart());
    return getSchemas()
      .then(schemas => {
        const {
          activity: { setActivitySchema },
          adjustment: { setAdjustmentSchema },
          agency: { setAgencySchema },
          alert: { setAlertSchema },
          alertSource: { setAlertSourceSchema },
          district: { setDistrictSchema },
          feature: { setFeatureSchema },
          focalPerson: { setFocalPersonSchema },
          indicator: { setIndicatorSchema },
          item: { setItemSchema },
          incidentType: { setIncidentTypeSchema },
          plan: { setPlanSchema },
          procedure: { setProcedureSchema },
          question: { setQuestionSchema },
          questionnaire: { setQuestionnaireSchema },
          region: { setRegionSchema },
          role: { setRoleSchema },
          stock: { setStockSchema },
          warehouse: { setWarehouseSchema },
        } = actions;

        const {
          Activity: activitySchema,
          Adjustment: adjustmentSchema,
          Agency: agencySchema,
          Alert: alertSchema,
          AlertSource: alertSourceSchema,
          District: districtSchema,
          Feature: featureSchema,
          FocalPerson: focalPersonSchema,
          IncidentType: incidentTypeSchema,
          Indicator: indicatorSchema,
          Item: itemSchema,
          Plan: planSchema,
          Procedure: procedureSchema,
          Question: questionSchema,
          Questionnaire: questionnaireSchema,
          Region: regionSchema,
          Role: roleSchema,
          Stock: stockSchema,
          Warehouse: warehouseSchema,
        } = schemas;

        dispatch(setActivitySchema(activitySchema));
        dispatch(setAdjustmentSchema(adjustmentSchema));
        dispatch(setAgencySchema(agencySchema));
        dispatch(setAlertSchema(alertSchema));
        dispatch(setAlertSourceSchema(alertSourceSchema));
        dispatch(setDistrictSchema(districtSchema));
        dispatch(setFeatureSchema(featureSchema));
        dispatch(setFocalPersonSchema(focalPersonSchema));
        dispatch(setIndicatorSchema(indicatorSchema));
        dispatch(setIncidentTypeSchema(incidentTypeSchema));
        dispatch(setItemSchema(itemSchema));
        dispatch(setPlanSchema(planSchema));
        dispatch(setProcedureSchema(procedureSchema));
        dispatch(setQuestionSchema(questionSchema));
        dispatch(setQuestionnaireSchema(questionnaireSchema));
        dispatch(setRegionSchema(regionSchema));
        dispatch(setRoleSchema(roleSchema));
        dispatch(setStockSchema(stockSchema));
        dispatch(setWarehouseSchema(warehouseSchema));
        dispatch(initializeAppSuccess());
      })
      .catch(error => {
        dispatch(initializeAppFailure(error));
      });
  };
}

/**
 * Thunk action to signin user/party
 *
 * @function
 * @name signin
 *
 * @param {object} credentials - Email and password
 * @param {Function} onSuccess - Callback for successfully signin
 * @param {Function} onError - Callback for failed signin
 * @returns {Promise} redux thunk
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function signin(credentials, onSuccess, onError) {
  return dispatch => {
    dispatch(signinStart());

    return login(credentials)
      .then(results => {
        const { party } = results;
        dispatch(signinSuccess(party));
        if (isFunction(onSuccess)) {
          onSuccess();
        }
      })
      .catch(error => {
        dispatch(signinFailure(error));
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
 * Wrapped signing thunk
 *
 * @function
 * @name wrappedSingin
 *
 * @param {object} credentials - email and password provided by user
 * @param {Function} onSuccess - Callback for successfully signin
 * @param {Function} onError - Callback for failed signin
 * @returns {Promise} - dispatched signing thunk
 *
 * @version 0.1.0
 * @since 0.10.3
 */
export function wrappedSingin(credentials, onSuccess, onError) {
  return storeDispatch(signin(credentials, onSuccess, onError));
}

/**
 * Wrapped singout action
 *
 * @function
 * @name wrappedSignout
 *
 * @returns {undefined}
 *
 * @version 0.2.0
 * @since 0.10.3
 */
export function wrappedSingout() {
  logout(); // clear sessionStorage
  return storeDispatch(signout());
}
