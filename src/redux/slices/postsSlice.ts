import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getPosts } from '../../api/posts';
import { ApiResponseBody, Post, PostsFilter } from '../../api/types';
import { RootState } from '../store';

interface PostsState {
  posts: Post[];
  filter: PostsFilter;
  page: number;
  isLoading: boolean;
  hasDoneInitialLoad: boolean;
}

const initialState: PostsState = {
  posts: [],
  filter: {
    locations: [],
    timesOfDay: [],
    days: [],
  },
  page: 0,
  isLoading: false,
  hasDoneInitialLoad: false,
};

const PostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<PostsFilter>) => {
      state.filter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    removePost: (state, action: PayloadAction<Post>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    },
    requestReloadOfPosts: (state) => {
      state.hasDoneInitialLoad = false;
    },
    setPostHasDoneInitialLoad: (state, action: PayloadAction<boolean>) => {
      state.hasDoneInitialLoad = action.payload;
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
    builder.addCase(getNextPageOfPosts.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getNewPageOfPostsWithFilter.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(reloadInitialPostsData.fulfilled, (state, _) => {
      state.hasDoneInitialLoad = true;
      state.isLoading = false;
    });
    builder.addCase(getInitialPostsData.pending, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getInitialPostsData.fulfilled, (state, _) => {
      state.isLoading = false;
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
  if (!thunkApi.getState().posts.hasDoneInitialLoad) {
    thunkApi.dispatch(setPostHasDoneInitialLoad(true));
    thunkApi.dispatch(setLoading(true));
    const resp = await thunkApi
      .dispatch(
        getNewPageOfPostsWithFilter({ locations: [], timesOfDay: [], days: [] })
      )
      .unwrap();
    return resp;
  }
  return { success: true, message: '' };
});

export const reloadInitialPostsData = createAsyncThunk<
  ApiResponseBody<Post[]>,
  undefined,
  { state: RootState }
>('posts/reloadInitialPostsData', async (_, thunkApi) => {
  await thunkApi
    .dispatch(
      getNewPageOfPostsWithFilter({ locations: [], timesOfDay: [], days: [] })
    )
    .unwrap();
  return { success: true, message: '' };
});

// set up persistence, uses local storage to persist this reducer
const postsPersistConfig = {
  key: 'posts',
  storage,
  blacklist: ['hasDoneInitialLoad', 'isLoading'],
};

const persistedPostsReducer = persistReducer(
  postsPersistConfig,
  PostsSlice.reducer
);

export const {
  removePost,
  requestReloadOfPosts,
  setLoading,
  setPostHasDoneInitialLoad,
} = PostsSlice.actions;

export default persistedPostsReducer;
