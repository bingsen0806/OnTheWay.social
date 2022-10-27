import { httpsCallable } from 'firebase/functions';
import { firestoreFunctions } from '../firebase';
import { ApiRequestBody, ApiResponseBody, Post, PostsFilter } from './types';

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
 *
 */
export async function getPosts(filter: PostsFilter, page: number) {
  const callApi = httpsCallable<ApiRequestBody, ApiResponseBody<Post[]>>(
    firestoreFunctions,
    'getExplorePost'
  );
  const result = await callApi({ page, filter });
  return result.data;
}
