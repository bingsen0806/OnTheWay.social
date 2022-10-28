import styles from './styles.module.scss';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  RefresherEventDetail,
  IonIcon,
  IonPopover,
} from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { helpCircleOutline } from 'ionicons/icons';
import EmptyArtPage from './EmptyArtPage';
import { getSelf } from '../../redux/slices/userSlice';
import ArtCard from './ArtCard';

export default function Art() {
  const obtainedArt = useAppSelector((state) => state.user.user.art ?? []);
  const dispatch = useAppDispatch();
  function refreshContents(event: CustomEvent<RefresherEventDetail>) {
    dispatch(getSelf())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  }

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
            Art
          </h1>
          <IonIcon
            slot="start"
            className={styles['icon']}
            icon={helpCircleOutline}
            id="art-popover"
          />
          <IonPopover trigger="art-popover" triggerAction="click">
            <IonContent class="ion-padding">
              These are AI-generated art pieces owned by you. Art pieces are
              randomly generated as you create, apply and accept study sessions
            </IonContent>
          </IonPopover>
        </IonToolbar>
      </IonHeader>
      <IonContent
        fullscreen
        className={obtainedArt.length > 0 ? styles['background'] : ''}
      >
        <IonRefresher slot="fixed" onIonRefresh={refreshContents}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonGrid className="ion-no-padding">
          <IonRow className={styles['row']}>
            <IonCol sizeMd="10" sizeLg="8" sizeXl="6">
              {obtainedArt.map((art) => (
                <ArtCard art={art} isCover={false} key={art.id}></ArtCard>
              ))}
            </IonCol>
          </IonRow>
        </IonGrid>
        {obtainedArt.length === 0 && <EmptyArtPage />}
      </IonContent>
    </IonPage>
  );
}
