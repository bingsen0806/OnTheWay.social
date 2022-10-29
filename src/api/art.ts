import { httpsCallable } from 'firebase/functions';
import { firestoreFunctions } from '../firebase';
import { ApiRequestBody, ApiResponseBody } from './types';

export async function changeArtVisibility(artId: string, isVisible: boolean) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    'changeArtVisibility'
  );
  const result = await callApi({ artId, isVisible });
  return result.data;
}

export async function setCover(artId: string) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    'setCover'
  );
  const result = await callApi({ artId });
  return result.data;
}

export async function deleteArt(artId: string) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
    firestoreFunctions,
    'deleteArt'
  );
  const result = await callApi({ artId });
  return result.data;
}
