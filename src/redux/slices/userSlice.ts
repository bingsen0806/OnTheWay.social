import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { RootState } from '../store';
import { User, Gender, Faculty, ApiResponseBody } from '../../api/types';
import { getSelfUser, getUser } from '../../api/user';

interface UserState {
  user: User;
  isLoading: boolean;
  selfLoadedOnce: boolean;
}

const initialState: UserState = {
  user: {
    id: '',
    name: '',
    gender: Gender.PREFER_NOT_TO_SAY,
    faculty: Faculty.COMPUTING,
    telegramHandle: '',
    year: 0,
    profilePhoto: '',
    thumbnailPhoto: '',
  },
  isLoading: false,
  selfLoadedOnce: false,
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserObject.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.user = action.payload.message as User;
      }
      state.isLoading = false;
    });
    builder.addCase(getUserObject.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getUserObject.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(reloadSelf.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.user = action.payload.message as User;
      }
      state.isLoading = false;
    });
    builder.addCase(getSelf.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.user = action.payload.message as User;
        state.selfLoadedOnce = true;
      }
      state.isLoading = false;
    });
    builder.addCase(getSelf.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getSelf.rejected, (state, _) => {
      state.isLoading = false;
    });
  },
});

/**
 * Get user
 */
export const getUserObject = createAsyncThunk<
  ApiResponseBody<User>,
  string,
  { state: RootState }
>('user/getUser', async (userId, _) => {
  const responseData = await getUser(userId);
  return responseData;
});

export const getSelf = createAsyncThunk<
  ApiResponseBody<User>,
  undefined,
  { state: RootState }
>('user/getSelf', async () => {
  const responseData = await getSelfUser();
  return responseData;
});

export const reloadSelf = createAsyncThunk<
  ApiResponseBody<User>,
  undefined,
  { state: RootState }
>('user/reloadSelf', async () => {
  const responseData = await getSelfUser();
  return responseData;
});

export const getInitialSelf = createAsyncThunk<
  ApiResponseBody<User>,
  undefined,
  { state: RootState }
>('user/geInitialSelf', async (_, thunkApi) => {
  if (!thunkApi.getState().user.selfLoadedOnce) {
    const resp = await thunkApi.dispatch(getSelf()).unwrap();
    return resp;
  }
  return { success: true, message: '' };
});

// set up persistence, uses local storage to persist this reducer
const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['selfLoadedOnce'],
};

const persistedPostsReducer = persistReducer(
  userPersistConfig,
  UserSlice.reducer
);

export default persistedPostsReducer;
