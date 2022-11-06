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
import signup from '../../assets/signup.json';
import Lottie from 'lottie-react';
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
  return (
    <IonPage>
      <IonContent>
        <IonGrid className="ion-no-padding">
          <IonRow className="ion-justify-content-center ion-align-items-center ion-no-padding">
            <IonCol size="8" sizeLg="4" className="ion-no-padding">
              <Lottie
                className={styles['animation']}
                animationData={signup}
                loop={false}
              />
            </IonCol>
            {isMobile && (
              <IonCol size="12" sizeLg="6">
                <h1 className="ion-text-center">{pageTitle}</h1>
              </IonCol>
            )}
            <IonCol size="12" sizeLg="8">
              {!isMobile && <h1 className="ion-text-center">{pageTitle}</h1>}
              {children}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
