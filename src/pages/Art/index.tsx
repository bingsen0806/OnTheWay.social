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
  useIonViewDidEnter,
  getPlatforms,
} from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { helpCircleOutline } from 'ionicons/icons';
import { reloadSelf } from '../../redux/slices/userSlice';
import ArtCard from './ArtCard';
import DesktopNavbar from '../../components/Navbar/DesktopNavbar';
import Footer from '../../components/Navbar/Footer';

export default function Art() {
  const obtainedArt = useAppSelector((state) => state.user.user.art ?? []);
  const dispatch = useAppDispatch();
  const isMobile = getPlatforms().includes('mobile');
  useIonViewDidEnter(() => {
    void dispatch(reloadSelf());
  });

  function refreshContents(event: CustomEvent<RefresherEventDetail>) {
    dispatch(reloadSelf())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  }

  return (
    <IonPage>
      {!isMobile && <DesktopNavbar />}
      <IonHeader>
        <IonToolbar>
          {isMobile && (
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
          )}
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
              These are AI-generated art pieces owned exclusively by you in the
              whole world. You get a randomly-generated art piece everyday if
              you create or apply to a study session, or accept an study buddy.
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

        <IonGrid className="">
          {obtainedArt.length > 0 ? (
            <IonRow className={styles['row']}>
              <IonCol sizeMd="6" sizeLg="4">
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
      {!isMobile && <Footer />}
    </IonPage>
  );
}
