import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getPosts, PostsFilter } from '../../api/posts';
import { Post } from '../../api/types';
import { RootState } from '../store';

interface PostsState {
  posts: Post[];
  filter: PostsFilter;
  page: number;
}

const initialState: PostsState = {
  posts: [],
  filter: {
    locations: [],
  },
  page: 0,
};

const PostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<PostsFilter>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNewPageOfPostsWithFilter.fulfilled, (state, action) => {
      state.page = 1;
      state.posts = action.payload;
      state.filter = action.meta.arg;
    });
    builder.addCase(getNextPageOfPosts.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        // only if a non empty page received then increment page
        state.page += 1;
        state.posts = state.posts.concat(action.payload);
      }
    });
  },
});

/**
 * Get new page of posts, with a new filter, resetting page back to 1.
 */
export const getNewPageOfPostsWithFilter = createAsyncThunk<
  Post[],
  PostsFilter,
  { state: RootState }
>('posts/getNewPageOfPostsWithFilter', async (filter, thunkApi) => {
  const responseData = await getPosts(filter, 1);
  return responseData;
});

/**
 * Get another page of posts with the current filter settings.
 */
export const getNextPageOfPosts = createAsyncThunk<
  Post[],
  undefined,
  { state: RootState }
>('posts/getNextPageOfPosts', async (_, thunkApi) => {
  const responseData = await getPosts(
    thunkApi.getState().posts.filter,
    thunkApi.getState().home.appliedRequestsPage + 1
  );
  return responseData;
});

// set up persistence, uses local storage to persist this reducer
const postsPersistConfig = {
  key: 'posts',
  storage,
};

const persistedPostsReducer = persistReducer(
  postsPersistConfig,
  PostsSlice.reducer
);

export default persistedPostsReducer;
