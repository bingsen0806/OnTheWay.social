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
            <IonCol size-lg="8" className="ion-no-padding">
              <img
                className={styles['header']}
                src="assets/images/login_background.jpg"
                alt="Login and register header"
              ></img>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center ion-no-padding">
            <IonCol size-lg="8" className="ion-no-padding">
              <IonRow className="ion-justify-content-center ion-padding-bottom">
                <IonCol>
                  <h1 className={styles['page-header-text']}>{pageTitle}</h1>
                </IonCol>
              </IonRow>
              {children}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
