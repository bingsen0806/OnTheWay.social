import { isPlatform, useIonToast } from '@ionic/react';
import { NotificationPayload, onMessage } from 'firebase/messaging';
import { notificationsOutline } from 'ionicons/icons';
import { messaging } from '../../firebase';
import { useAppDispatch } from '../../redux/hooks';
import { loadNotifications } from '../../redux/slices/notificationsSlice';

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
      presentToast(payload.notification!);
    });
  }
}
