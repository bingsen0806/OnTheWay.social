import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  getPlatforms,
  IonPage,
  IonIcon,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import TextInputField from '../../components/TextInputField/TextInputField';
import useInfoToast from '../../util/hooks/useInfoToast';
import { resetPassword } from '../../api/authentication';
import { isValidNUSEmail } from './constants';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { arrowBackOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';

interface ResetPasswordModalProps {
  isOpen: boolean;
  closeCallback: () => void;
}

export default function ResetPasswordModal({
  isOpen,
  closeCallback,
}: ResetPasswordModalProps) {
  const isMobile = getPlatforms().includes('mobile');
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const presentInfoToast = useInfoToast();
  const handleUnknownError = useUnknownErrorHandler();
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    if (!location.search.includes('modal=true')) {
      closeCallback();
    }
  }, [location]);

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
      onWillDismiss={() => {
        if (location.search.includes('modal=true')) {
          history.goBack();
        }
        closeCallback();
      }}
      mode="ios"
    >
      <IonPage>
        <IonHeader>
          <IonToolbar>
            {isMobile && (
              <IonButtons slot="start">
                <IonButton
                  fill="clear"
                  color="dark"
                  onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
                    event.stopPropagation();
                    closeCallback();
                  }}
                >
                  <IonIcon icon={arrowBackOutline} slot="start" />
                  <p>Back</p>
                </IonButton>
              </IonButtons>
            )}
            <IonTitle>Reset Password</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <h2 className="ion-padding-start">
            Enter the email registered to your account
          </h2>
          <p className="ion-padding-start">
            A password recovery email will be sent to this email. Please wait
            for a few minutes after pressing submit to receieve it. It may be in
            your junk folder.
          </p>
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-margin-top">
              <IonCol sizeMd="11">
                <div>
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
                  className="ion-margin-top"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Send
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </IonModal>
  );
}
