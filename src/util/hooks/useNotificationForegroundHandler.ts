import { isPlatform, useIonToast } from '@ionic/react';
import { NotificationPayload, onMessage } from 'firebase/messaging';
import { notificationsOutline } from 'ionicons/icons';
import { messaging } from '../../firebase';
import { useAppDispatch } from '../../redux/hooks';
import { reloadInitialData } from '../../redux/slices/homeSlice';
import { loadNotifications } from '../../redux/slices/notificationsSlice';
import { reloadSelf } from '../../redux/slices/userSlice';

function getNotificationToastColor(title: string) {
  if (
    title.endsWith(' has applied to the study session') ||
    title === 'You have been accepted to study session'
  ) {
    return 'success';
  } else if (
    title.endsWith(' has cancelled their study session application') ||
    title === 'The study session you applied for has been cancelled'
  ) {
    return 'danger';
  } else {
    return 'primary';
  }
}

/**
 * Hook that returns a function that presents a toast to user.
 */
export default function useNotificationForegroundHandler() {
  const [present] = useIonToast();
  const dispatch = useAppDispatch();
  const presentToast = (notification: NotificationPayload) => {
    void present({
      message: notification.title,
      color: getNotificationToastColor(notification.title!),
      duration: 2000,
      position: 'top',
      icon: notificationsOutline,
    });
  };
  if (!isPlatform('ios')) {
    onMessage(messaging, (payload) => {
      void dispatch(loadNotifications(false));
      if (
        payload.notification &&
        (payload.notification.title?.endsWith(
          ' has applied to the study session'
        ) ||
          payload.notification.title ===
            'You have been accepted to study session' ||
          payload.notification.title?.endsWith(
            ' has cancelled their study session application'
          ) ||
          payload.notification.title ===
            'The study session you applied for has been cancelled')
      ) {
        // refresh home page if related notification comes in
        void dispatch(reloadInitialData());
      } else if (
        payload.notification &&
        payload.notification.title ===
          "You've got a new art piece! Go check it out!"
      ) {
        void dispatch(reloadSelf());
      }
      presentToast(payload.notification!);
    });
  }
}
