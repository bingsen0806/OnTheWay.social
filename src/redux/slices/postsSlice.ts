import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getPosts, PostsFilter } from '../../api/posts';
import { ApiResponseBody, Post } from '../../api/types';
import { RootState } from '../store';

interface PostsState {
  posts: Post[];
  filter: PostsFilter;
  page: number;
  isLoading: boolean;
}

const initialState: PostsState = {
  posts: [],
  filter: {
    locations: [],
  },
  page: 0,
  isLoading: false,
};

const PostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<PostsFilter>) => {
      state.filter = action.payload;
    },
    removePost: (state, action: PayloadAction<Post>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNewPageOfPostsWithFilter.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success) {
        state.page = 1;
        state.posts = action.payload.message as Post[];
        state.filter = action.meta.arg;
      }
    });
    builder.addCase(getNextPageOfPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success) {
        if (action.payload.message.length > 0) {
          // only if a non empty page received then increment page
          state.page += 1;
          state.posts = state.posts.concat(action.payload.message as Post[]);
        }
      }
    });
    builder.addCase(getNextPageOfPosts.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getNewPageOfPostsWithFilter.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getNextPageOfPosts.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getNewPageOfPostsWithFilter.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getInitialPostsData.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getInitialPostsData.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getInitialPostsData.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success) {
        state.page = 1;
        state.posts = action.payload.message as Post[];
      }
    });
  },
});

/**
 * Get new page of posts, with a new filter, resetting page back to 1.
 */
export const getNewPageOfPostsWithFilter = createAsyncThunk<
  ApiResponseBody<Post[]>,
  PostsFilter,
  { state: RootState }
>('posts/getNewPageOfPostsWithFilter', async (filter, _) => {
  const responseData = await getPosts(filter, 1);
  return responseData;
});

/**
 * Get another page of posts with the current filter settings.
 */
export const getNextPageOfPosts = createAsyncThunk<
  ApiResponseBody<Post[]>,
  undefined,
  { state: RootState }
>('posts/getNextPageOfPosts', async (_, thunkApi) => {
  const responseData = await getPosts(
    thunkApi.getState().posts.filter,
    thunkApi.getState().home.appliedRequestsPage + 1
  );
  return responseData;
});

/**
 * Get initial data if lists are empty.
 */
export const getInitialPostsData = createAsyncThunk<
  ApiResponseBody<Post[]>,
  undefined,
  { state: RootState }
>('posts/getInitialPostsData', async (_, thunkApi) => {
  if (thunkApi.getState().posts.posts.length > 0) {
    return { success: true, message: thunkApi.getState().posts.posts };
  }
  const responseData = await getPosts({ locations: [] }, 1);
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

export const { removePost } = PostsSlice.actions;

export default persistedPostsReducer;
