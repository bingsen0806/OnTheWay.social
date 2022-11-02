import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  getPlatforms,
} from '@ionic/react';
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
  const isMobile = getPlatforms().includes('mobile');
  console.log(isMobile);
  return (
    <IonPage>
      <IonContent>
        <IonGrid className="ion-no-padding">
          <IonRow className="ion-justify-content-center ion-align-items-center ion-no-padding">
            <IonCol size="8" sizeLg="6" className="ion-no-padding">
              <img
                className={styles['header']}
                src="assets/images/login_background.jpg"
                alt="Login and register header"
              ></img>
            </IonCol>
            {isMobile && (
              <IonCol size="12" sizeLg="6">
                <h1 className="ion-text-center">{pageTitle}</h1>
              </IonCol>
            )}
            <IonCol size="12" sizeLg="6">
              {!isMobile && <h1 className="ion-text-center">{pageTitle}</h1>}
              {children}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
