import { IonButton, IonCol, IonLabel, IonRow } from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { login, LoginDetails } from '../../api/authentication';
import TextInputField from '../../components/TextInputField/TextInputField';
import { analytics } from '../../firebase';
import { REGISTER } from '../../routes';
import useErrorToast from '../../util/hooks/useErrorToast';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import AuthenticationPageContainer from './AuthenticationPageContainer';
import { isValidNUSEmail } from './constants';
import styles from './styles.module.scss';
import { useAppDispatch } from '../../redux/hooks';
import {
  reloadInitialData,
  requestReloadOfHomeData,
} from '../../redux/slices/homeSlice';
import {
  reloadInitialPostsData,
  requestReloadOfPosts,
} from '../../redux/slices/postsSlice';
import ResetPasswordModal from './ResetPasswordModal';
import ButtonSpinner from '../../components/ButtonSpinner';
import { useHistory } from 'react-router-dom';
interface LoginErrorMessages {
  email: string;
  password: string;
}

/**
 * Login page component.
 */
export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentErrorToast = useErrorToast();
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState<boolean>(false);
  const handleUnknownError = useUnknownErrorHandler();
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState<LoginErrorMessages>({
    email: '',
    password: '',
  });

  function checkForErrorsInInputFields(): boolean {
    let haveError = false;
    const newErrorMessages = {
      email: '',
      password: '',
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
    }

    setErrorMessages(newErrorMessages);
    return haveError;
  }

  async function submitLogin() {
    if (checkForErrorsInInputFields()) {
      // have error, give up the login
      return;
    }

    setIsLoading(true);

    try {
      await login(loginDetails);
      dispatch(requestReloadOfHomeData());
      dispatch(requestReloadOfPosts());
      const promises = [
        dispatch(reloadInitialData()),
        dispatch(reloadInitialPostsData()),
      ];
      await Promise.all(promises);
      logEvent(analytics, 'login');
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        (error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found')
      ) {
        presentErrorToast('Email and/or password is incorrect.');
      } else {
        handleUnknownError(error);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  const historyObject = useHistory();

  return (
    <AuthenticationPageContainer pageTitle="Welcome back!">
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="6" className={styles['input-field-col']}>
          <TextInputField
            name="email"
            autocomplete="email"
            label="Email"
            placeholder="Email"
            value={loginDetails?.email}
            errorMessage={errorMessages?.email}
            onChange={(email) => {
              setLoginDetails({ ...loginDetails, email });
            }}
          />
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
      {!isLoading && (
        <IonRow className="ion-margin-bottom ion-justify-content-center">
          <IonCol
            size="10"
            sizeMd="6"
            onClick={() => {
              historyObject.push({ search: '?modal=true' });
              setIsResetPasswordModalOpen(true);
            }}
            className={styles['forgotten-password-container']}
          >
            <IonLabel>
              <p>Forgot your password?</p>
            </IonLabel>
          </IonCol>
        </IonRow>
      )}
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="4">
          <IonButton
            onClick={() => {
              if (!isLoading) {
                void submitLogin();
              }
            }}
            expand="block"
          >
            {isLoading ? <ButtonSpinner /> : 'Login'}
          </IonButton>
        </IonCol>
      </IonRow>

      {!isLoading && (
        <p className="ion-text-center">
          Don't have an account?{' '}
          <a href={REGISTER}>
            <u>Sign up</u>
          </a>
        </p>
      )}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        closeCallback={() => {
          setIsResetPasswordModalOpen(false);
        }}
      ></ResetPasswordModal>
    </AuthenticationPageContainer>
  );
}
