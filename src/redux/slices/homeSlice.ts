import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getAppliedRequests, getCreatedRequests } from '../../api/home';
import { AppliedRequest, CreatedRequest } from '../../api/types';
import { RootState } from '../store';

interface HomeState {
  appliedRequests: AppliedRequest[];
  createdRequests: CreatedRequest[];
  appliedRequestsPage: number;
  createdRequestsPage: number;
}

const initialState: HomeState = {
  appliedRequests: [],
  createdRequests: [],
  appliedRequestsPage: 0,
  createdRequestsPage: 0,
};

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNewPageOfAppliedRequests.fulfilled, (state, action) => {
      state.appliedRequestsPage = 1;
      state.appliedRequests = action.payload;
    });
    builder.addCase(getNewPageOfCreatedRequests.fulfilled, (state, action) => {
      state.createdRequestsPage = 1;
      state.createdRequests = action.payload;
    });
    builder.addCase(getNextPageOfAppliedRequests.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        // only if a non empty page received then increment page
        state.appliedRequestsPage += 1;
        state.appliedRequests = state.appliedRequests.concat(action.payload);
      }
    });
    builder.addCase(getNextPageOfCreatedRequests.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        // only if a non empty page received then increment page
        state.createdRequestsPage += 1;
        state.createdRequests = state.createdRequests.concat(action.payload);
      }
    });
  },
});

/**
 * Gets a fresh new page of applied requests, and resets page back to page 1.
 * To be used when first navigating to the home page.
 */
export const getNewPageOfAppliedRequests = createAsyncThunk<
  AppliedRequest[],
  undefined,
  { state: RootState }
>('home/getNewPageOfAppliedRequests', async (_, thunkApi) => {
  const responseData = await getAppliedRequests(1);
  return responseData;
});

/**
 * Gets a fresh new page of created requests, and resets page back to page 1.
 * To be used when first navigating to home page
 */
export const getNewPageOfCreatedRequests = createAsyncThunk<
  CreatedRequest[],
  undefined,
  { state: RootState }
>('home/getNewPageOfCreatedRequests', async (_, thunkApi) => {
  const responseData = await getCreatedRequests(1);
  return responseData;
});

/**
 * Gets the next page of applied requests, and increments the page number if there is anymore data.
 */
export const getNextPageOfAppliedRequests = createAsyncThunk<
  AppliedRequest[],
  undefined,
  { state: RootState }
>('home/getNextPageOfAppliedRequests', async (_, thunkApi) => {
  const responseData = await getAppliedRequests(
    thunkApi.getState().home.appliedRequestsPage + 1
  );
  return responseData;
});

/**
 * Gets the next page of created requests, and increments the page number if there is anymore data.
 */
export const getNextPageOfCreatedRequests = createAsyncThunk<
  CreatedRequest[],
  undefined,
  { state: RootState }
>('home/getNextPageOfCreatedRequests', async (_, thunkApi) => {
  const responseData = await getCreatedRequests(
    thunkApi.getState().home.appliedRequestsPage + 1
  );
  return responseData;
});

// set up persistence, uses local storage to persist this reducer
const homePersistConfig = {
  key: 'home',
  storage,
};

const persistedHomeReducer = persistReducer(
  homePersistConfig,
  HomeSlice.reducer
);

export default persistedHomeReducer;
