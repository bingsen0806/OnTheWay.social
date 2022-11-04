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
  hasDoneInitialLoad: boolean;
}

const initialState: HomeState = {
  appliedRequests: [],
  createdRequests: [],
  appliedRequestsPage: 0,
  createdRequestsPage: 0,
  isLoading: false,
  hasDoneInitialLoad: false,
};

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    /**
    cancelApplicantOfCreatedRequest: (
      state,
      action: PayloadAction<{ applicantUserId: string; postId: string }>
    ) => {
      const newCreatedRequests = [];
      for (let i = 0; i < state.createdRequests.length; i++) {
        let changedParticipant;
        const createdRequest = state.createdRequests[i];
        if (createdRequest.post.id === action.payload.postId) {
          const newParticipants = [];
          for (const participant of createdRequest.post.participants) {
            if (participant.id !== action.payload.applicantUserId) {
              newParticipants.push(participant);
            } else {
              changedParticipant = participant;
            }
          }
          const newApplicants = [...createdRequest.applicants] as User[];
          newApplicants.push(changedParticipant as User);
          createdRequest.post.participants = newParticipants;
          createdRequest.applicants = newApplicants;
          //TODO: check if this mutable change is fine
          newCreatedRequests.push(createdRequest);
        } else {
          newCreatedRequests.push(createdRequest);
        }
        state.createdRequests = newCreatedRequests;
      }
    },
    acceptApplicantOfCreatedRequest: (
      state,
      action: PayloadAction<{ applicantUserId: string; postId: string }>
    ) => {
      const newCreatedRequests = [];
      for (let i = 0; i < state.createdRequests.length; i++) {
        let changedParticipant;
        const createdRequest = state.createdRequests[i];
        if (createdRequest.post.id === action.payload.postId) {
          const newApplicants = [];
          for (const applicant of createdRequest.applicants) {
            if (applicant.id !== action.payload.applicantUserId) {
              newApplicants.push(applicant);
            } else {
              changedParticipant = applicant;
            }
          }
          const newParticipants = [...createdRequest.post.participants] as User[];
          newParticipants.push(changedParticipant as User);
          createdRequest.post.participants = newParticipants;
          createdRequest.applicants = newApplicants;
          //TODO: check if this mutable change is fine
          newCreatedRequests.push(createdRequest);
        } else {
          newCreatedRequests.push(createdRequest);
        }
        state.createdRequests = newCreatedRequests;
      }
    },
    */
    replaceCreatedRequest: (state, action: PayloadAction<CreatedRequest>) => {
      const newCreatedRequests: CreatedRequest[] = [];
      for (const createdRequest of state.createdRequests) {
        if (createdRequest.post.id !== action.payload.post.id) {
          newCreatedRequests.push(createdRequest);
        } else {
          newCreatedRequests.push(action.payload);
        }
      }
      state.createdRequests = newCreatedRequests;
    },
    removeCreatedRequest: (state, action: PayloadAction<string>) => {
      state.createdRequests = state.createdRequests.filter(
        (req) => req.post.id !== action.payload
      );
    },
    removeAppliedRequest: (state, action: PayloadAction<string>) => {
      state.appliedRequests = state.appliedRequests.filter(
        (appliedRequest) => appliedRequest.post.id !== action.payload
      );
    },

    /** Resets the has done initial load back to false, so home data will reload */
    requestReloadOfHomeData: (state) => {
      state.hasDoneInitialLoad = false;
    },
    setHomeHasDoneInitialLoad: (state, action: PayloadAction<boolean>) => {
      state.hasDoneInitialLoad = action.payload;
    },
    setHomeIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNewPageOfAppliedRequests.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.appliedRequestsPage = 1;
        state.appliedRequests = action.payload.message as AppliedRequest[];
      }
    });
    builder.addCase(getNewPageOfCreatedRequests.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.createdRequestsPage = 1;
        state.createdRequests = action.payload.message as CreatedRequest[];
      }
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
    });
    builder.addCase(getNextPageOfAppliedRequests.pending, (state, _) => {
      // state.isLoading = true;
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
      // state.isLoading = true;
    });
    builder.addCase(getNextPageOfCreatedRequests.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(getInitialData.fulfilled, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(reloadInitialData.fulfilled, (state, _) => {
      state.hasDoneInitialLoad = true;
      state.isLoading = false;
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
export const reloadInitialData = createAsyncThunk<
  ApiResponseBody<string>,
  undefined,
  { state: RootState }
>('home/reloadData', async (_, thunkApi) => {
  const promises = [
    thunkApi.dispatch(getNewPageOfAppliedRequests()).unwrap(),
    thunkApi.dispatch(getNewPageOfCreatedRequests()).unwrap(),
  ];
  await Promise.all(promises);
  return { success: true, message: '' };
});

/**
 * Gets the initial homepage data if no data currently in store.
 */
export const getInitialData = createAsyncThunk<
  ApiResponseBody<string>,
  undefined,
  { state: RootState }
>('home/getInitialData', async (_, thunkApi) => {
  if (!thunkApi.getState().home.hasDoneInitialLoad) {
    thunkApi.dispatch(setHomeHasDoneInitialLoad(true));
    thunkApi.dispatch(setHomeIsLoading(true));
    await thunkApi.dispatch(getNewPageOfAppliedRequests()).unwrap();
    await thunkApi.dispatch(getNewPageOfCreatedRequests()).unwrap();
    return { success: true, message: '' };
  }
  return { success: true, message: '' };
});

export const {
  replaceCreatedRequest,
  removeAppliedRequest,
  removeCreatedRequest,
  requestReloadOfHomeData,
  setHomeIsLoading,
  setHomeHasDoneInitialLoad,
} = HomeSlice.actions;

// set up persistence, uses local storage to persist this reducer
const homePersistConfig = {
  key: 'home',
  storage,
  blacklist: ['hasDoneInitialLoad', 'isLoading'],
};

const persistedHomeReducer = persistReducer(
  homePersistConfig,
  HomeSlice.reducer
);

export default persistedHomeReducer;
