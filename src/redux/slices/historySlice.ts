import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ApiResponseBody, UserHistory } from '../../api/types';
import { requestUserHistory } from '../../api/user';
import { RootState } from '../store';

interface HistoryState {
  history: UserHistory;
  isLoading: boolean;
  wasLoadedOnce: boolean;
}

const initialState: HistoryState = {
  history: {} as UserHistory,
  isLoading: false,
  wasLoadedOnce: false,
};

const HistorySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserHistory.fulfilled, (state, action) => {
      state.isLoading = false;
      if (!state.wasLoadedOnce) {
        state.wasLoadedOnce = true;
      }
      if (action.payload.success) {
        state.history = action.payload.message as UserHistory;
      }
    });
    builder.addCase(getUserHistory.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getUserHistory.rejected, (state, _) => {
      state.isLoading = false;
    });
  },
});

/**
 * Get new page of posts, with a new filter, resetting page back to 1.
 */
export const getUserHistory = createAsyncThunk<
  ApiResponseBody<UserHistory>,
  undefined,
  { state: RootState }
>('history/getUserHistory', async () => {
  const responseData = await requestUserHistory();
  return responseData;
});

// set up persistence, uses local storage to persist this reducer
const historyPersistConfig = {
  key: 'history',
  storage,
  blacklist: ['isLoading', 'wasLoadedOnce'],
};

const persistedHistoryReducer = persistReducer(
  historyPersistConfig,
  HistorySlice.reducer
);

export default persistedHistoryReducer;
