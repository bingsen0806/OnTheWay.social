import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { RootState } from '../store';
import { User, Gender, Faculty } from '../../api/types';
import { getSelfUser, getUser } from '../../api/user';

interface UserState {
  user: User;
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
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserObject.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getSelf.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

/**
 * Get user
 */
export const getUserObject = createAsyncThunk<
  User,
  string,
  { state: RootState }
>('user/getUser', async (userId, _) => {
  const responseData = await getUser(userId);
  return responseData;
});

export const getSelf = createAsyncThunk<User, undefined, { state: RootState }>(
  'user/getSelf',
  async () => {
    const responseData = await getSelfUser();
    return responseData;
  }
);

// set up persistence, uses local storage to persist this reducer
const userPersistConfig = {
  key: 'user',
  storage,
};

const persistedPostsReducer = persistReducer(
  userPersistConfig,
  UserSlice.reducer
);

export default persistedPostsReducer;
