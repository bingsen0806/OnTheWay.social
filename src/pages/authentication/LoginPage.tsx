import { IonCol, IonRow } from '@ionic/react';
import { useState } from 'react';
import { login, LoginDetails } from '../../api/authentication';
import TextInputField from '../../components/TextInputField/TextInputField';
import AuthenticationPageContainer from './AuthenticationPageContainer';
import styles from './styles.module.scss';

interface LoginErrorMessages {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState<LoginErrorMessages>({
    email: '',
    password: '',
  });

  function submitLogin() {
    login(loginDetails);
  }

  return (
    <AuthenticationPageContainer>
      <IonRow className="ion-justify-content-center ion-padding-vertical">
        <IonCol>
          <h1 className={styles['page-header-text']}>Login</h1>
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-vertical">
        <IonCol className={styles['input-field-col']}>
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
      <IonRow className="ion-padding-vertical">
        <IonCol>
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
    </AuthenticationPageContainer>
  );
}
