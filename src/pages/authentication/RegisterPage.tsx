import {
  IonButton,
  IonCol,
  IonContent,
  IonPopover,
  IonRow,
} from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { LoginDetails, signUp } from '../../api/authentication';
import ButtonSpinner from '../../components/ButtonSpinner';
import TextInputField from '../../components/TextInputField/TextInputField';
import { analytics } from '../../firebase';
import { LOGIN } from '../../routes';
import useErrorToast from '../../util/hooks/useErrorToast';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import AuthenticationPageContainer from './AuthenticationPageContainer';
import { isValidNUSEmail } from './constants';
import styles from './styles.module.scss';

interface RegisterErrorMessages {
  email: string;
  password: string;
  confirmationPassword: string;
}

/**
 * Login page component.
 * TODO: forgot password functionality after MVP.
 */
export default function RegisterPage() {
  const presentErrorToast = useErrorToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleUnknownError = useUnknownErrorHandler();
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: '',
    password: '',
  });
  const [confirmationPassword, setConfirmationPassword] = useState<string>('');
  const [errorMessages, setErrorMessages] = useState<RegisterErrorMessages>({
    email: '',
    password: '',
    confirmationPassword: '',
  });

  function checkForErrorsInInputFields(): boolean {
    let haveError = false;
    const newErrorMessages = {
      email: '',
      password: '',
      confirmationPassword: '',
    };
    if (!loginDetails.email) {
      newErrorMessages.email = 'Please enter your NUS email.';
      haveError = true;
    } else if (!isValidNUSEmail(loginDetails.email)) {
      newErrorMessages.email = 'Email must be a NUS email.';
      haveError = true;
    }

    if (!loginDetails.password) {
      newErrorMessages.password = 'Please enter your password.';
      haveError = true;
    } else if (loginDetails.password.length < 6) {
      newErrorMessages.password =
        'Password must be at least 6 characters long.';
      haveError = true;
    }

    if (!confirmationPassword) {
      newErrorMessages.confirmationPassword = 'Please confirm your password.';
      haveError = true;
    } else if (confirmationPassword !== loginDetails.password) {
      newErrorMessages.confirmationPassword = 'Passwords do not match.';
    }

    setErrorMessages(newErrorMessages);
    return haveError;
  }

  async function submitSignUp(): Promise<void> {
    if (checkForErrorsInInputFields()) {
      // have error, give up the login
      return;
    }
    setIsLoading(true);
    try {
      await signUp(loginDetails);
      logEvent(analytics, 'sign_up');
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === 'auth/email-already-in-use'
      ) {
        presentErrorToast('Email already registered.');
      } else {
        handleUnknownError(error);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthenticationPageContainer pageTitle="Register">
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="6" className={styles['input-field-col']}>
          <TextInputField
            label="NUS Email"
            placeholder="NUS Email"
            value={loginDetails?.email}
            errorMessage={errorMessages?.email}
            onChange={(email) => {
              setLoginDetails({ ...loginDetails, email });
            }}
          />
          <p className={styles['popover-text']} id="nus-email-popover">
            Why NUS emails only?
          </p>
          <IonPopover trigger="nus-email-popover" triggerAction="click">
            <IonContent class="ion-padding">
              BuddyNUS is currently only deployed for NUS students. To guarantee
              authentic users, we require verified NUS emails during
              registration.
            </IonContent>
          </IonPopover>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="6">
          <TextInputField
            label="Password"
            placeholder="Password"
            value={loginDetails?.password}
            errorMessage={errorMessages?.password}
            onChange={(password) => {
              setLoginDetails({ ...loginDetails, password });
            }}
            type="password"
          />
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="10" sizeMd="6">
          <TextInputField
            label="Confirm Password"
            placeholder="Confirm Password"
            value={confirmationPassword}
            errorMessage={errorMessages.confirmationPassword}
            onChange={(confirmationPassword) => {
              setConfirmationPassword(confirmationPassword);
            }}
            type="password"
          />
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="10" sizeMd="4">
          <IonButton
            onClick={() => {
              if (!isLoading) {
                void submitSignUp();
              }
            }}
            expand="block"
          >
            {isLoading ? <ButtonSpinner /> : 'Sign Up'}
          </IonButton>
        </IonCol>
      </IonRow>
      {!isLoading && (
        <p className="ion-text-center">
          Already have an account?{' '}
          <a href={LOGIN}>
            <u>Login</u>
          </a>
        </p>
      )}
    </AuthenticationPageContainer>
  );
}
