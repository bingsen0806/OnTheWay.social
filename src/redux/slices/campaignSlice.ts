import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiResponseBody, Campaign } from '../../api/types';
import { getUserCampaigns } from '../../api/campaigns';
import { RootState } from '../store';

interface CampaignState {
  campaigns: Campaign[];
  isLoading: boolean;
}

const campaigns: Campaign[] = [];

const initialState: CampaignState = {
  campaigns,
  isLoading: false,
};

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetCampaigns(state) {
      state.campaigns = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserCampaignsThunk.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.campaigns = action.payload.message as Campaign[];
        console.log(action.payload.message);
      }
      state.isLoading = false;
    });
    builder.addCase(getUserCampaignsThunk.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(getUserCampaignsThunk.rejected, (state, _) => {
      state.isLoading = false;
    });
  },
});

/**
 * Get user's campaigns
 */
export const getUserCampaignsThunk = createAsyncThunk<
  ApiResponseBody<Campaign[]>,
  undefined,
  { state: RootState }
>('campaigns/getUserCampaigns', async () => {
  console.log('called');
  const responseData = await getUserCampaigns();
  return responseData;
});

// set up persistence, uses local storage to persist this reducer
const campaignPersistConfig = {
  key: 'campaigns',
  storage,
};

const persistedCampaignReducer = persistReducer(
  campaignPersistConfig,
  campaignSlice.reducer
);

export default persistedCampaignReducer;
export const { resetCampaigns } = campaignSlice.actions;
