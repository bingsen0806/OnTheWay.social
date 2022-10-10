import { useIonToast } from '@ionic/react';
import { alert } from 'ionicons/icons';

/**
 * Hook that returns a function that takes in an Api error and presents an error toast to user.
 */
export default function useErrorToast() {
  const [present] = useIonToast();
  const presentToast = (message: string) => {
    void present({
      message,
      color: 'danger',
      duration: 2000,
      position: 'top',
      icon: alert,
    });
  };
  return presentToast;
}
