import { generateReportExposedActions } from '../factories/action';
import { dispatch } from '../store';

export const { getActionsReport } = generateReportExposedActions(
  'action',
  dispatch
);
export const { getAlertsReport } = generateReportExposedActions(
  'alert',
  dispatch
);
export const { getCasesReport } = generateReportExposedActions(
  'case',
  dispatch
);
export const { getDispatchesReport } = generateReportExposedActions(
  'dispatch',
  dispatch
);
export const { getEffectsReport } = generateReportExposedActions(
  'effect',
  dispatch
);
export const { getEventsReport } = generateReportExposedActions(
  'event',
  dispatch
);
export const { getIndicatorsReport } = generateReportExposedActions(
  'indicator',
  dispatch
);

export const { getNeedsReport } = generateReportExposedActions(
  'need',
  dispatch
);
export const { getOverviewsReport } = generateReportExposedActions(
  'overview',
  dispatch
);
export const { getPartiesReport } = generateReportExposedActions(
  'party',
  dispatch
);
export const { getResourcesReport } = generateReportExposedActions(
  'resource',
  dispatch
);
export const { getRisksReport } = generateReportExposedActions(
  'risk',
  dispatch
);
