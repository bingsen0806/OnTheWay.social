import { httpsCallable } from 'firebase/functions';
import { firestoreFunctions } from '../firebase';
import { ApiRequestBody, ApiResponseBody, BuddyNotification } from './types';

export async function getNotifications() {
  const callApi = httpsCallable<
    ApiRequestBody,
    ApiResponseBody<BuddyNotification[]>
  >(firestoreFunctions, 'getNotifications');
  const result = await callApi({});
  return result.data;
}

export async function markNotificationAsViewed(id: string) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    'markNotification'
  );
  const result = await callApi({ id });
  return result.data;
}

export async function sendNotificationRegistrationToken(token: string) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    'sendNotificationToken'
  );
  const result = await callApi({ token });
  return result.data;
}
