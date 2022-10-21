import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  getNotifications,
  markNotificationAsViewed,
} from '../../api/notifications';
import { ApiResponseBody, BuddyNotification } from '../../api/types';

interface NotificationsState {
  notifications: BuddyNotification[];
  isLoading: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  isLoading: false,
};

const NotificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadNotifications.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.notifications = action.payload.message as BuddyNotification[];
      }
      state.isLoading = false;
    });
    builder.addCase(loadNotifications.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(loadNotifications.rejected, (state, _) => {
      state.isLoading = false;
    });
    builder.addCase(markNotification.fulfilled, (state, action) => {
      let indexToReplace = 0;
      for (let i = 0; i < state.notifications.length; i++) {
        if (state.notifications[i].id === action.meta.arg) {
          indexToReplace = i;
        }
      }
      const newNotification = { ...state.notifications[indexToReplace] };
      newNotification.hasBeenViewed = true;

      state.notifications[indexToReplace] = newNotification;
    });
  },
});

/**
 * Get user
 */
export const loadNotifications = createAsyncThunk<
  ApiResponseBody<BuddyNotification[]>,
  undefined
>('notifications/loadNotifications', async () => {
  const responseData = await getNotifications();
  return responseData;
});

export const markNotification = createAsyncThunk<
  ApiResponseBody<string>,
  string
>('notifications/markNotification', async (notificationId, _) => {
  const responseData = await markNotificationAsViewed(notificationId);
  return responseData;
});

// set up persistence, uses local storage to persist this reducer
const notificationsPersistConfig = {
  key: 'notifications',
  storage,
  blacklist: ['isLoading'],
};

const persistedNotificationsReducer = persistReducer(
  notificationsPersistConfig,
  NotificationsSlice.reducer
);

export default persistedNotificationsReducer;
