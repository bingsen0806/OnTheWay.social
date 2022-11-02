import { httpsCallable } from 'firebase/functions';
import { firestoreFunctions } from '../firebase';
import { User, ApiRequestBody, ApiResponseBody } from './types';
import { uploadImage } from './uploader';

/**
 * Get user object
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

export function uploadImageAndStoreToDb(
  user: User,
  image: File,
  success: () => void,
  failed: (e: string) => void
) {
  const callback = async (urls: string[]) => {
    if (urls.length !== 2) {
      return;
    }
    const thumbnailPhoto = urls[1];
    const updatedUser: User = {
      id: user.id,
      name: user.name,
      gender: user.gender,
      faculty: user.faculty,
      telegramHandle: user.telegramHandle,
      year: user.year,
      profilePhoto: user.profilePhoto,
      thumbnailPhoto: thumbnailPhoto,
    };
    const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<string>>(
      firestoreFunctions,
      'updateUser'
    );
    const res = await callApi({ user: updatedUser });
    if (res.data.success) {
      success();
    } else {
      failed(res.data.message);
    }
  };
  return uploadImage(image, user.id, callback);
}
