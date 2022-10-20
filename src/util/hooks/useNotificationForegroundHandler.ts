import { useIonToast } from '@ionic/react';
import { NotificationPayload, onMessage } from 'firebase/messaging';
import { notificationsOutline } from 'ionicons/icons';
import { messaging } from '../../firebase';

/**
 * Hook that returns a function that presents a toast to user.
 */
export default function useNotificationForegroundHandler() {
  const [present] = useIonToast();
  const presentToast = (notification: NotificationPayload) => {
    void present({
      message: notification.title,
      color: 'primary',
      duration: 2000,
      position: 'top',
      icon: notificationsOutline,
    });
  };
  onMessage(messaging, (payload) => {
    //TODO: remove console.log
    console.log(payload);
    presentToast(payload.notification!);
  });
}
