import { getApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  StorageReference,
  uploadBytes,
} from 'firebase/storage';
import Compressor from 'compressorjs';
import { bucket } from '../firebase';
const bucketName = bucket;

// Get a non-default Storage bucket
const firebaseApp = getApp();
const storage = getStorage(firebaseApp, bucketName);

function byteToMegabyte(bytes: number) {
  return bytes / 1024 ** 2;
}

function compressImage(
  image: File,
  successCallback: (compressed: File) => Promise<any>,
  failedCallback: () => Promise<any>
) {
  const maxWidth = 200;
  const quality = 0.8;
  const options = {
    maxWidth,
    quality,
    success: successCallback,
    error: failedCallback,
  };
  return new Compressor(image, options);
}

async function uploadFilesAndGetUrl(
  original: File,
  originalRef: StorageReference,
  compressed: File,
  compressedRef: StorageReference
) {
  const promises = [
    uploadBytes(originalRef, original),
    uploadBytes(compressedRef, compressed),
  ];
  await Promise.all(promises);
  const urlPromises = [
    getDownloadURL(originalRef),
    getDownloadURL(compressedRef),
  ];
  const urls = await Promise.all(urlPromises);
  return urls;
}

/**
 * Takes in image, userId, and a callback
 * @param image Image user uploaded
 * @param userId UserId of user who uploaded the image
 * @param callback Function which takes in an array of string, array[0] being the full res image URL, array[1] being the compressed image URL
 */
export function uploadImage(
  image: File,
  userId: string,
  callback: (urls: string[]) => Promise<void>
) {
  const fileExt = image.name.split('.').pop();
  if (!fileExt) {
    return;
  }
  const profilePath = `profilePhoto/${userId}.${fileExt}`;
  const thumbnailPath = `profilePhoto/${userId}-compressed.${fileExt}`;
  const profileStorageRef = ref(storage, profilePath);
  const thumbnailStorageRef = ref(storage, thumbnailPath);

  const failedCompress = async () => {
    const urls = await uploadFilesAndGetUrl(
      image,
      profileStorageRef,
      image,
      thumbnailStorageRef
    );
    return callback(urls);
  };
  const successCompress = async (compressed: File) => {
    const urls = await uploadFilesAndGetUrl(
      image,
      profileStorageRef,
      compressed,
      thumbnailStorageRef
    );
    return callback(urls);
  };
  return compressImage(image, successCompress, failedCompress);
}
