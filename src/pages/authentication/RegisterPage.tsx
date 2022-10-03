import { IonButton, IonCol, IonLoading, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { REGISTER } from 'redux-persist';
import { login, LoginDetails, signUp } from '../../api/authentication';
import TextInputField from '../../components/TextInputField/TextInputField';
import { HOME, LOGIN } from '../../routes';
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
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      confirmationPassword,
    };
    if (!loginDetails.email) {
      newErrorMessages.email = 'Please enter you NUS email.';
      haveError = true;
    } else if (!isValidNUSEmail(loginDetails.email)) {
      newErrorMessages.email = 'Email must be a NUS email.';
      haveError = true;
    }

    if (!loginDetails.password) {
      newErrorMessages.password = 'Please enter your password.';
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

  async function submitSignUp() {
    if (checkForErrorsInInputFields()) {
      // have error, give up the login
      return;
    }

    setIsLoading(true);
    try {
      await signUp(loginDetails);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthenticationPageContainer>
      <IonRow className="ion-justify-content-center ion-padding-bottom">
        <IonCol>
          <h1 className={styles['page-header-text']}>Sign Up</h1>
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="10" className={styles['input-field-col']}>
          <TextInputField
            label="NUS Email"
            placeholder="NUS Email"
            value={loginDetails?.email}
            errorMessage={errorMessages?.email}
            onChange={(email) => {
              setLoginDetails({ ...loginDetails, email });
            }}
          />
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="10">
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
        <IonCol size="10">
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
        <IonCol size="10">
          <IonButton onClick={submitSignUp} expand="block">
            Sign Up
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonCol size="10">
          Already have an account?{' '}
          <a href={LOGIN}>
            <u>Login</u>
          </a>
        </IonCol>
      </IonRow>
      <IonLoading isOpen={isLoading}></IonLoading>
    </AuthenticationPageContainer>
  );
}
