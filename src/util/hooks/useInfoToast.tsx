import { useIonToast } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';

/**
 * Hook that returns a function that presents a toast to user.
 */
export default function useInfoToast() {
  const [present] = useIonToast();
  const presentToast = (message: string, color?: string) => {
    void present({
      message,
      color: color ? color : 'success',
      duration: 2000,
      position: 'top',
      icon: informationCircleOutline,
    });
  };
  return presentToast;
}
