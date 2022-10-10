import { IonButton, IonCol, IonRow } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  deleteCurrentUser,
  resendEmailVerification,
} from '../../api/authentication';
import { PROFILE_CREATION } from '../../routes';
import { useAuthState } from '../../util/authentication';
import useInfoToast from '../../util/hooks/useInfoToast';
import AuthenticationPageContainer from './AuthenticationPageContainer';
import styles from './styles.module.scss';

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
    <AuthenticationPageContainer pageTitle="Email Verification">
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="10" className={styles['input-field-col']}>
          <h2>
            Please click on the verification link sent to your email at{' '}
            {auth.currentUser?.email}
          </h2>
          <p>The email might be in your spam or junk folder.</p>
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="5">
          <IonButton
            expand="block"
            color="medium"
            onClick={() => {
              void cancelSignUp();
            }}
          >
            Cancel
          </IonButton>
        </IonCol>
        <IonCol size="5">
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
