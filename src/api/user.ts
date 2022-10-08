import { httpsCallable } from 'firebase/functions';
import { firestoreFunctions } from '../firebase';
import {
  User,
  ApiRequestBody,
  ApiResponseBody,
} from './types';

/**
 * Get user object
 * TODO: add firebase func call.
 */
export async function getUser(userId: string) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<User>>(
    firestoreFunctions,
    'getUser'
  );
  const result = await callApi({ userId });
  return result.data;
}

export async function getSelfUser() {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<User>>(
    firestoreFunctions,
    'getCurrentUser'
  );
  const result = await callApi({});
  return result.data;
}

export async function uploadImage() {
  //TODO: Upload image
}
