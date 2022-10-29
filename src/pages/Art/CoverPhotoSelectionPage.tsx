import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import { useAppSelector } from '../../redux/hooks';
import styles from './styles.module.scss';

export default function CoverPhotoSelectionPage() {
  const art = useAppSelector((root) => root.user.user.art);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <h1
            slot="start"
            className={`ion-padding-start ${styles['art-header-text']}`}
          >
            Cover Photo
          </h1>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2 className="ion-padding-start">
          Choose a cover photo from your own personal art pieces!
        </h2>
        <p className="ion-padding-start">
          Art pieces are randomly created as you create, apply and accept study
          sessions. These art pieces are AI-generated and one-of-a-kind.
        </p>
        {!art || art?.length === 0 ? (
          <p className="ion-padding-start">
            You don't have any art at the moment!
          </p>
        ) : (
          <IonGrid>
            <IonRow>
              {art.map((artPiece) => (
                <IonCol size="6" key={artPiece.id}>
                  <IonImg src={artPiece.image}></IonImg>
                </IonCol>
              ))}
              <IonCol></IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
}
