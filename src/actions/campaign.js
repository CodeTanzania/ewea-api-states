import generateExposedActions from '../factories/action';
import { actions, dispatch } from '../store';

const campaignActions = generateExposedActions('campaign', actions, dispatch);

export const {
  clearCampaignFilters,
  clearCampaignsSort,
  closeCampaignForm,
  deleteCampaign,
  filterCampaigns,
  getCampaigns,
  getCampaign,
  selectCampaign,
  openCampaignForm,
  paginateCampaigns,
  postCampaign,
  putCampaign,
  refreshCampaigns,
  searchCampaigns,
  setCampaignSchema,
  sortCampaigns,
} = campaignActions;
