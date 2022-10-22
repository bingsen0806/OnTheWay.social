import { BuddyNotification } from './api/types';

export function getNumberOfUnviewedNotifications(
  notifications: BuddyNotification[]
) {
  let count = 0;
  notifications.forEach((notif) => {
    if (!notif.hasBeenViewed) {
      count++;
    }
  });
  return count;
}
