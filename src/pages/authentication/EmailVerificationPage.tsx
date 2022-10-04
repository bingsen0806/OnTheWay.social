import { IonButton, IonCol, IonLoading, IonRow } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { login, LoginDetails } from '../../api/authentication';
import TextInputField from '../../components/TextInputField/TextInputField';
import { HOME, REGISTER } from '../../routes';
import AuthenticationPageContainer from './AuthenticationPageContainer';
import { isValidNUSEmail } from './constants';
import styles from './styles.module.scss';

/**
 * Login page component.
 * TODO: forgot password functionality after MVP.
 */
export default function EmailVerificationPage() {
  const auth = getAuth();
  return (
    <AuthenticationPageContainer pageTitle="Email Verification">
      <IonRow className="ion-padding-bottom ion-justify-content-center">
        <IonCol size="10" className={styles['input-field-col']}>
          <h2>
            Please click on the verification link sent to your email at{' '}
            {auth.currentUser?.email}
          </h2>
        </IonCol>
      </IonRow>
    </AuthenticationPageContainer>
  );
}
