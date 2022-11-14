import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonToolbar,
  IonHeader,
} from '@ionic/react';
import Lottie from 'lottie-react';
import animationData from '../../assets/404.json';
import { BROWSE } from '../../routes';
import styles from './styles.module.scss';

export default function PageNotFound() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <h2 className="ion-text-center">Page not found</h2>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid className={styles['text-button-container']}>
          <IonRow className="ion-justify-content-center">
            <IonCol className="ion-align-items-center"></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <Lottie
                className={styles['animation']}
                animationData={animationData}
                loop={true}
              />
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
