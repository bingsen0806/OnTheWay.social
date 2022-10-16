import { useIonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ErrorType } from '../../api/errors';
import { alert } from 'ionicons/icons';
import { LOGIN, PROFILE_CREATION } from '../../routes';

/**
 * Universal error handler for common error across pages
 */
export default function useCheckedErrorHandler() {
  const history = useHistory();
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

  function handleCheckedError(errorMessage: string) {
    switch (errorMessage) {
      case ErrorType.NOT_AUTHENTICATED:
        displayErrorToast('You are not logged in!');
        history.replace(LOGIN);
        return;
      case ErrorType.USER_PROFILE_NOT_CREATED:
        displayErrorToast('You have not created your profile yet!');
        history.replace(PROFILE_CREATION);
        return;
      case ErrorType.POST_NOT_FOUND:
        displayErrorToast('Post not found. It may have already been deleted');
        return;
      default:
        displayErrorToast('An unknown error occured.');
        console.log(errorMessage);
    }
  }

  return handleCheckedError;
}
