import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  getNotifications,
  markNotificationAsViewed,
} from '../../api/notifications';
import {
  ApiResponseBody,
  AppliedRequest,
  BuddyNotification,
  CreatedRequest,
} from '../../api/types';

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
  reducers: {
    // removes a notification that id of a request that has been deleted.
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((notif) => {
        if (
          !notif.data ||
          !(notif.data as CreatedRequest | AppliedRequest).post
        ) {
          return true;
        } else if (
          (notif.data as CreatedRequest | AppliedRequest).post.id ===
          action.payload
        ) {
          return false;
        } else {
          return true;
        }
      });
    },
    // update a notification in the list of notifications
    replaceNotification: (state, action: PayloadAction<CreatedRequest>) => {
      const newNotifs: BuddyNotification[] = [];
      for (const notif of state.notifications) {
        if (
          !((notif.data as CreatedRequest).post?.id === action.payload.post.id)
        ) {
          newNotifs.push(notif);
        } else {
          newNotifs.push({ ...notif, data: action.payload });
        }
      }
      state.notifications = newNotifs;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadNotifications.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.notifications = action.payload.message as BuddyNotification[];
      }
      state.isLoading = false;
    });
    builder.addCase(loadNotifications.pending, (state, action) => {
      // only if the load is not a silent load, then set loading
      if (!action.meta.arg) {
        state.isLoading = true;
      }
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
 * Get notifications
 */
export const loadNotifications = createAsyncThunk<
  ApiResponseBody<BuddyNotification[]>,
  boolean
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

export const { removeNotification, replaceNotification } =
  NotificationsSlice.actions;

export default persistedNotificationsReducer;
