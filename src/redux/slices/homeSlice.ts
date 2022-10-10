import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { getAppliedRequests, getCreatedRequests } from '../../api/home';
import {
  ApiResponseBody,
  AppliedRequest,
  CreatedRequest,
} from '../../api/types';
import { RootState } from '../store';

interface HomeState {
  appliedRequests: AppliedRequest[];
  createdRequests: CreatedRequest[];
  appliedRequestsPage: number;
  createdRequestsPage: number;
  isLoading: boolean;
}

const initialState: HomeState = {
  appliedRequests: [],
  createdRequests: [],
  appliedRequestsPage: 0,
  createdRequestsPage: 0,
  isLoading: false,
};

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setApplicantStatusOfCreatedRequest: (
      state,
      action: PayloadAction<{ applicantUserId: string; postId: string }>
    ) => {
      const newCreatedRequests = [];
      for (let i = 0; i < state.createdRequests.length; i++) {
        const createdRequest = state.createdRequests[i];
        if (createdRequest.post.id === action.payload.postId) {
          // remove the user from list of applicants
          const newApplicants = [];
          for (const applicant of createdRequest.applicants) {
            if (applicant.id !== action.payload.applicantUserId) {
              newApplicants.push(applicant);
            }
          }
          createdRequest.applicants = newApplicants;
          newApplicants.push(createdRequest);
        } else {
          newCreatedRequests.push(createdRequest);
        }
        state.createdRequests = newCreatedRequests;
      }
    },
    removeAppliedRequest: (state, action: PayloadAction<AppliedRequest>) => {
      state.appliedRequests = state.appliedRequests.filter(
        (appliedRequest) => appliedRequest.post.id !== action.payload.post.id
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNewPageOfAppliedRequests.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.appliedRequestsPage = 1;
        state.appliedRequests = action.payload.message as AppliedRequest[];
      }
      state.isLoading = false;
    });
    builder.addCase(getNewPageOfAppliedRequests.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getNewPageOfAppliedRequests.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getNewPageOfCreatedRequests.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.createdRequestsPage = 1;
        state.createdRequests = action.payload.message as CreatedRequest[];
      }
      state.isLoading = false;
    });
    builder.addCase(getNewPageOfCreatedRequests.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getNewPageOfCreatedRequests.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getNextPageOfAppliedRequests.fulfilled, (state, action) => {
      if (action.payload.success) {
        if (action.payload.message.length > 0) {
          // only if a non empty page received then increment page
          state.appliedRequestsPage += 1;
          state.appliedRequests = state.appliedRequests.concat(
            action.payload.message as AppliedRequest[]
          );
        }
      }
      state.isLoading = false;
    });
    builder.addCase(getNextPageOfAppliedRequests.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getNextPageOfAppliedRequests.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getNextPageOfCreatedRequests.fulfilled, (state, action) => {
      if (action.payload.success) {
        if (action.payload.message.length > 0) {
          // only if a non empty page received then increment page
          state.createdRequestsPage += 1;
          state.createdRequests = state.createdRequests.concat(
            action.payload.message as CreatedRequest[]
          );
        }
      }
      state.isLoading = false;
    });
    builder.addCase(getNextPageOfCreatedRequests.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getNextPageOfCreatedRequests.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getInitialData.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getInitialData.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getInitialData.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success) {
        const respData = action.payload.message as {
          appliedRequests: AppliedRequest[];
          createdRequests: CreatedRequest[];
        };
        state.appliedRequestsPage = 1;
        state.appliedRequests = respData.appliedRequests;
        state.createdRequestsPage = 1;
        state.createdRequests = respData.createdRequests;
      }
    });
  },
});

/**
 * Gets a fresh new page of applied requests, and resets page back to page 1.
 * To be used when first navigating to the home page.
 */
export const getNewPageOfAppliedRequests = createAsyncThunk<
  ApiResponseBody<AppliedRequest[]>,
  undefined,
  { state: RootState }
>('home/getNewPageOfAppliedRequests', async () => {
  const responseData = await getAppliedRequests(1);
  return responseData;
});

/**
 * Gets a fresh new page of created requests, and resets page back to page 1.
 * To be used when first navigating to home page
 */
export const getNewPageOfCreatedRequests = createAsyncThunk<
  ApiResponseBody<CreatedRequest[]>,
  undefined,
  { state: RootState }
>('home/getNewPageOfCreatedRequests', async () => {
  const responseData = await getCreatedRequests(1);
  return responseData;
});

/**
 * Gets the next page of applied requests, and increments the page number if there is anymore data.
 */
export const getNextPageOfAppliedRequests = createAsyncThunk<
  ApiResponseBody<AppliedRequest[]>,
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
  ApiResponseBody<CreatedRequest[]>,
  undefined,
  { state: RootState }
>('home/getNextPageOfCreatedRequests', async (_, thunkApi) => {
  const responseData = await getCreatedRequests(
    thunkApi.getState().home.appliedRequestsPage + 1
  );
  return responseData;
});

/**
 * Gets the initial homepage data if no data currently in store.
 */
export const getInitialData = createAsyncThunk<
  ApiResponseBody<{
    appliedRequests: AppliedRequest[];
    createdRequests: CreatedRequest[];
  }>,
  undefined,
  { state: RootState }
>('home/getInitialData', async (_, thunkApi) => {
  if (
    thunkApi.getState().home.appliedRequests.length <= 0 ||
    thunkApi.getState().home.createdRequests.length <= 0
  ) {
    const appliedRequestsResp = await getAppliedRequests(1);
    const createdRequestsResp = await getCreatedRequests(1);

    if (!appliedRequestsResp.success) {
      return { success: false, message: appliedRequestsResp.message as string };
    }

    if (!createdRequestsResp.success) {
      return { success: false, message: createdRequestsResp.message as string };
    }

    return {
      success: true,
      message: {
        appliedRequests: appliedRequestsResp.message as AppliedRequest[],
        createdRequests: createdRequestsResp.message as CreatedRequest[],
      },
    };
  }
  return {
    success: true,
    message: {
      appliedRequests: thunkApi.getState().home.appliedRequests,
      createdRequests: thunkApi.getState().home.createdRequests,
    },
  };
});

export const { setApplicantStatusOfCreatedRequest, removeAppliedRequest } =
  HomeSlice.actions;

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
