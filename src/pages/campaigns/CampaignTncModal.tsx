import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Campaign } from '../../api/types';
import { arrowBackOutline } from 'ionicons/icons';
import styles from './styles.module.scss';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

export default function CampaignModal({
  isOpen,
  onClose,
  campaign,
}: CampaignModalProps) {
  const tnc = campaign.tncs;
  const tncWithParas = tnc.split('<p>');
  const finalTncValue = [];
  for (const tncWithPara of tncWithParas) {
    const trimmed = tncWithPara.trim();
    if (trimmed.length > 0) {
      finalTncValue.push(`${trimmed.substring(0, trimmed.length - 4)}`); //minus closing </p> tag
    }
  }
  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={onClose}
      className={styles['modal-container']}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Terms and Conditions</IonTitle>
          <IonButtons slot="start">
            <IonButton
              fill="clear"
              color="dark"
              onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
                event.stopPropagation();
                onClose();
              }}
            >
              <IonIcon icon={arrowBackOutline} slot="start" />
              <p>Back</p>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="10" sizeMd="8" sizeLg="6">
              <h1>Terms and conditions</h1>
              {finalTncValue.map((str) => (
                <p key={str}>{str}</p>
              ))}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}
