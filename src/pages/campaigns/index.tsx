import styles from './styles.module.scss';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonAccordionGroup,
  IonAccordion,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonThumbnail,
  RefresherEventDetail,
} from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserCampaignsThunk } from '../../redux/slices/campaignSlice';
import moment from 'moment';
import CampaignModal from './CampaignTncModal';
import { useState } from 'react';
export default function Campaigns() {
  const campaigns = useAppSelector((state) => state.campaigns.campaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }
  const dispatch = useAppDispatch();

  function refreshContents(event: CustomEvent<RefresherEventDetail>) {
    dispatch(getUserCampaignsThunk())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  }

  const items = campaigns.map((campaign, i) => {
    const campaignStart = moment(campaign.startDateTime).format('DD MMM YYYY');
    const campaignEnd = moment(campaign.endDateTime).format('DD MMM YYYY');
    return (
      <div key={campaign.title}>
        <IonAccordion value={i.toString()} color="light">
          <IonItem slot="header" color="light">
            <IonLabel>{campaign.title}</IonLabel>
            <IonThumbnail slot="start">
              <IonImg src={campaign.image} />
            </IonThumbnail>
          </IonItem>
          <div className="ion-padding" slot="content">
            <IonImg src={campaign.image} className={styles['img-graphic']} />
            <IonGrid>
              <IonRow className="ion-padding-start ion-justify-content-center">
                <IonCol size="10" sizeMd="8" sizeLg="6">
                  <h4 className={styles['bold']}>
                    Number of chances: {campaign.chances}
                  </h4>
                  <h4>Begins on: {campaignStart}</h4>
                  <h4>Ends on: {campaignEnd}</h4>
                  <p>{campaign.description}</p>
                  <p className={styles['tnc']} onClick={openModal}>
                    Terms and conditions
                  </p>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </IonAccordion>
        <CampaignModal
          isOpen={isModalOpen}
          onClose={closeModal}
          campaign={campaign}
        />
      </div>
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Campaigns</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refreshContents}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonGrid>
          <h1 className="ion-text-center">Campaigns</h1>
          <IonRow className={styles['row']}>
            <IonCol size="11" sizeMd="8" sizeLg="6">
              <IonAccordionGroup className={styles['bg']}>
                {items}
              </IonAccordionGroup>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
