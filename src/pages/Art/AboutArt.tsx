import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import noArtScreen from '../../assets/art.jpg';
import styles from './styles.module.scss';

export default function AboutArtPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <h1 className="ion-padding-start ion-no-margin">About Art</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <img src={noArtScreen} className={styles['empty-image']} />
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="10" sizeLg="6">
              <div className="ion-padding-start ion-text-center">
                <h2>
                  Get your very first piece of digital art that you own
                  exclusively!
                </h2>
                <p>
                  Everyday if you create, apply for a study session or accept an
                  applicant, you have the chance to receive 1 AI-generated piece
                  of art. Your art collection is visible to other users on
                  BuddyNUS on your profile.
                </p>
                <p>
                  What you get every time is completely random. It could be a
                  masterpiece, or it could be less than aesthetic. Thats part of
                  the fun!
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
