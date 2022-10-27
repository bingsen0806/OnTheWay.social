import styles from './styles.module.scss';
import { RWebShare } from 'react-web-share';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
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
  IonCard,
  getPlatforms,
  IonImg,
  IonPopover,
} from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import moment from 'moment';
import {
  helpCircleOutline,
  shareOutline,
  shareSocialOutline,
} from 'ionicons/icons';
import EmptyArtPage from './EmptyArtPage';
import { getSelf } from '../../redux/slices/userSlice';

export default function Art() {
  const platforms = getPlatforms();
  const isIOS = platforms.includes('ios');
  const obtainedArt = useAppSelector((state) => state.user.user.art ?? []);
  const dispatch = useAppDispatch();
  function refreshContents(event: CustomEvent<RefresherEventDetail>) {
    dispatch(getSelf())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  }
  const shareText =
    'Check out my AI-generated art piece that is owned exclusively by me on BuddyNUS!';

  const title = 'Share your AI-generated art!';

  const items = obtainedArt.map((art) => {
    const dateObtained = moment(art.date).calendar();
    return (
      <IonCard key={art.id} className={styles['no-shadow']}>
        <div className="ion-margin">
          <IonImg src={art.image} className={styles['center-image']} />
          <div>
            <p className={styles['description']}>{art.description}</p>
          </div>
          <RWebShare data={{ text: shareText, title, url: art.image }}>
            <IonIcon
              icon={isIOS ? shareOutline : shareSocialOutline}
              className={styles['share']}
            ></IonIcon>
          </RWebShare>
          <p className={styles['light-text']}>{dateObtained}</p>
        </div>
      </IonCard>
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="ion-align-items-start">
          <IonTitle>
            Art
            <IonIcon
              className={styles['icon']}
              icon={helpCircleOutline}
              id="art-popover"
            />
          </IonTitle>

          <IonPopover trigger="art-popover" triggerAction="click">
            <IonContent class="ion-padding">
              These are AI-generated art pieces owned by you. Art pieces are
              randomly generated as you create, apply and accept study sessions
            </IonContent>
          </IonPopover>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent
        fullscreen
        className={items.length > 0 ? styles['background'] : ''}
      >
        <IonRefresher slot="fixed" onIonRefresh={refreshContents}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonGrid>
          <IonRow className={styles['row']}>
            <IonCol size="11" sizeMd="8" sizeLg="6" sizeXl="5">
              {items}
            </IonCol>
          </IonRow>
        </IonGrid>
        {items.length === 0 && <EmptyArtPage />}
      </IonContent>
    </IonPage>
  );
}
