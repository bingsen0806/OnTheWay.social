import { IonButton, IonCol, IonRow } from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  deleteCurrentUser,
  resendEmailVerification,
} from '../../api/authentication';
import { analytics } from '../../firebase';
import { PROFILE_CREATION } from '../../routes';
import { useAuthState } from '../../util/authentication';
import useInfoToast from '../../util/hooks/useInfoToast';
import AuthenticationPageContainer from './AuthenticationPageContainer';

/**
 * Email verification page.
 */
export default function EmailVerificationPage() {
  const auth = getAuth();
  const authState = useAuthState();
  const presentInfoToast = useInfoToast();
  const history = useHistory();

  useEffect(() => {
    // try reloading the user every second to see if email was verified
    const timer = setInterval(() => {
      authState
        .reloadUser()
        .then(() => {
          const auth = getAuth();
          if (auth.currentUser?.emailVerified) {
            history.replace(PROFILE_CREATION);
            presentInfoToast(
              'Email verified. Please fill in your account details.'
            );
            logEvent(analytics, 'email_verified');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  });

  async function submitResendEmailRequest() {
    try {
      await resendEmailVerification();
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelSignUp() {
    try {
      await deleteCurrentUser();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthenticationPageContainer pageTitle="">
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="10" className="ion-text-center">
          <h2>
            Please click on the verification link sent to your email at{' '}
            {auth.currentUser?.email}
          </h2>
          <p className="ion-text-center">
            The email might be in your spam or junk folder.
          </p>
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="5" sizeMd="2" sizeLg="1">
          <IonButton
            expand="block"
            fill="outline"
            color="medium"
            onClick={() => {
              void cancelSignUp();
            }}
          >
            Cancel
          </IonButton>
        </IonCol>
        <IonCol size="5" sizeMd="3" sizeLg="2">
          <IonButton
            expand="block"
            onClick={() => {
              void submitResendEmailRequest();
            }}
          >
            Resend
          </IonButton>
        </IonCol>
      </IonRow>
    </AuthenticationPageContainer>
  );
}
