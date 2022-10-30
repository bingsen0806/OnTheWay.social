import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useState } from 'react';
import styles from './styles.module.scss';
import TextInputField from '../../components/TextInputField/TextInputField';
import useInfoToast from '../../util/hooks/useInfoToast';
import { resetPassword } from '../../api/authentication';
import { isValidNUSEmail } from './constants';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';

interface ResetPasswordModalProps {
  isOpen: boolean;
  closeCallback: () => void;
}

export default function ResetPasswordModal({
  isOpen,
  closeCallback,
}: ResetPasswordModalProps) {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const presentInfoToast = useInfoToast();
  const handleUnknownError = useUnknownErrorHandler();

  function handleSubmit() {
    if (!email) {
      setErrorMessage('Please enter your NUS email.');
      return;
    } else if (!isValidNUSEmail(email)) {
      setErrorMessage('Email must be a NUS email.');
      return;
    }

    resetPassword(email)
      .then(() => {
        presentInfoToast('Password Recovery email has been sent!');
        closeCallback();
      })
      .catch((error) => {
        handleUnknownError(error);
      });
  }

  return (
    <IonModal
      isOpen={isOpen}
      className={styles['reset-password-modal']}
      onWillDismiss={closeCallback}
      mode="ios"
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeCallback} color="dark">
              <IonIcon icon={arrowBackOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2 className="ion-padding-start">
          Enter the email registered to your account
        </h2>
        <p className="ion-padding-start">
          A password recovery email will be sent to this email. Please wait for
          a few minutes after pressing submit to receieve it. It may be in your
          junk folder.
        </p>
        <div className="ion-padding-start ion-padding-end">
          <TextInputField
            label="Email"
            placeholder="Email"
            value={email}
            errorMessage={errorMessage}
            onChange={(email) => {
              setEmail(email);
            }}
          />
        </div>

        <IonButton
          expand="block"
          className="ion-margin-top ion-padding-start ion-padding-end"
          onClick={() => {
            handleSubmit();
          }}
        >
          Send
        </IonButton>
      </IonContent>
    </IonModal>
  );
}
