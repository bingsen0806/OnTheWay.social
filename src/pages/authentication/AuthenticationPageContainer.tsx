import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import { ReactNode } from 'react';
import styles from './styles.module.scss';

interface AuthenticationPageContainerProps {
  children: ReactNode;
  pageTitle: string;
}

/**
 * Wrapper container for all authentication pages.
 */
export default function AuthenticationPageContainer({
  children,
  pageTitle,
}: AuthenticationPageContainerProps) {
  return (
    <IonPage>
      <IonContent>
        <IonGrid fixed className="ion-no-padding">
          <IonRow className="ion-justify-content-center ion-no-padding">
            <IonCol size="8" sizeMd="4" sizeLg="3" className="ion-no-padding">
              <img
                className={styles['header']}
                src="assets/images/login_background.jpg"
                alt="Login and register header"
              ></img>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size-lg="8" className="ion-margin">
              <h1 className={styles['page-header-text']}>{pageTitle}</h1>
            </IonCol>
            <IonCol size="12">{children}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <br></br>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <br></br>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <br></br>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <br></br>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
