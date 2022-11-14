import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import Lottie from 'lottie-react';
import animationData from '../../assets/404.json';
import { BROWSE } from '../../routes';
import styles from './styles.module.scss';

export default function PageNotFound() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Lottie animationData={animationData} loop={true} />
        <IonGrid className={styles['text-button-container']}>
          <IonRow className="ion-justify-content-center">
            <IonCol className="ion-align-items-center">
              <h2 className="ion-text-center">
                The page you requested does not exist!
              </h2>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="6" className={styles['button-col']}>
              <IonButton routerLink={BROWSE}>Go back home</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
