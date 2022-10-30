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
              These are AI-generated art pieces owned by you. You get a 1
              randomly-generated art piece everyday if you create or apply to a
              study session, or accept an study buddy.
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
          {obtainedArt.length > 0 ? (
            <IonRow className={styles['row']}>
              <IonCol sizeMd="10" sizeLg="8" sizeXl="6">
                {obtainedArt.map((art) => (
                  <ArtCard art={art} isCover={false} key={art.id}></ArtCard>
                ))}
              </IonCol>
            </IonRow>
          ) : (
            <IonRow className={styles['empty-row']}>
              <IonCol size="10">
                <h1 className="ion-text-center">
                  No art pieces yet! Go create or apply to some study sessions!
                </h1>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
