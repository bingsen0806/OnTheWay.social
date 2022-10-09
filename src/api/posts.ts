import { httpsCallable } from 'firebase/functions';
import { firestoreFunctions } from '../firebase';
import { ApiRequestBody, ApiResponseBody, Location, Post } from './types';

export interface PostsFilter {
  locations: Location[];
}

export async function createPost(post: Post) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<Post[]>>(
    firestoreFunctions,
    'createPost'
  );
  const result = await callApi({ post });
  return result.data;
}

/**
 * Get a page of posts with given filter and page number.
 * TODO: add firebase func call.
 *
 */
export async function getPosts(filter: PostsFilter, page: number) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<Post[]>>(
    firestoreFunctions,
    'getPost'
  );
  const result = await callApi({ page, location: filter.locations });
  return result.data;
}
