import { useIonToast } from '@ionic/react';
import { alert } from 'ionicons/icons';

/**
 * Universal error handler for common error across pages
 */
export default function useUnknownErrorHandler() {
  const [present] = useIonToast();

  function displayErrorToast(message: string) {
    void present({
      message,
      color: 'danger',
      duration: 2000,
      position: 'top',
      icon: alert,
    });
  }

  function handleUnknownError(error: unknown) {
    displayErrorToast('An unknown error occured. Please try again.');
    console.log(error);
    return;
  }

  return handleUnknownError;
}
