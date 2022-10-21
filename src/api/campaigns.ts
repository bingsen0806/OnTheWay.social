import { httpsCallable } from 'firebase/functions';
import { firestoreFunctions } from '../firebase';
import { ApiRequestBody, ApiResponseBody, Campaign } from './types';

/**
 * Get user campaigns
 */
export async function getUserCampaigns() {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<Campaign[]>>(
    firestoreFunctions,
    'getUserCampaigns'
  );
  const result = await callApi({});
  return result.data;
}
