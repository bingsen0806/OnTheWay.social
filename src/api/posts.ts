import { Post } from './types';

export interface PostsFilter {
  locations: Location[];
}

/**
 * Get a page of posts with given filter and page number.
 * TODO: add firebase func call.
 */
export async function getPosts(filter: PostsFilter, page: number) {
  const sampleData: Post[] = [];
  return sampleData;
}
