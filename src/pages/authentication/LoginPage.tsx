import { IonButton, IonCol, IonLoading, IonRow } from '@ionic/react';
import { useState } from 'react';
import { login, LoginDetails } from '../../api/authentication';
import TextInputField from '../../components/TextInputField/TextInputField';
import { REGISTER } from '../../routes';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import AuthenticationPageContainer from './AuthenticationPageContainer';
import { isValidNUSEmail } from './constants';
import styles from './styles.module.scss';

interface LoginErrorMessages {
  email: string;
  password: string;
}

/**
 * Login page component.
 * TODO: forgot password functionality after MVP.
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    } catch (error) {
      //TODO: add more specific error handling for authentication
      handleUnknownError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthenticationPageContainer pageTitle="Login">
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="10" className={styles['input-field-col']}>
          <TextInputField
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
          <IonButton
            onClick={() => {
              void submitLogin();
            }}
            expand="block"
          >
            Login
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonCol size="10">
          <p>
            Don't have an account?{' '}
            <a href={REGISTER}>
              <u>Sign up</u>
            </a>
          </p>
        </IonCol>
      </IonRow>
      <IonLoading isOpen={isLoading}></IonLoading>
    </AuthenticationPageContainer>
  );
}
