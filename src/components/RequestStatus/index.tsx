import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { AppliedRequestStatus } from '../../api/types';
import { copyOutline } from 'ionicons/icons';
import styles from './styles.module.scss';
import useInfoToast from '../../util/hooks/useInfoToast';

interface RequestStatusProps {
  status: AppliedRequestStatus;
  telegramHandle: string;
}

const getStatusLabel = (status: AppliedRequestStatus) => {
  switch (status) {
    case AppliedRequestStatus.ACCEPTED:
      return <IonCol className={styles['status-accepted']}>Accepted!</IonCol>;
    case AppliedRequestStatus.PENDING:
      return <IonCol className={styles['status-pending']}>Pending</IonCol>;
    case AppliedRequestStatus.REJECTED:
      return <IonCol className={styles['status-rejected']}>Rejected</IonCol>;
    default:
      return (
        <IonCol className={styles['status-unknown']}>Unknown Status</IonCol>
      );
  }
};

export default function RequestStatus({
  status,
  telegramHandle,
}: RequestStatusProps) {
  const presentInfoToast = useInfoToast();
  return (
    <IonGrid className="ion-margin-vertical">
      <IonRow
        className={
          styles['non-bold-header'] +
          ' ion-padding-start ion-justify-content-start'
        }
      >
        <IonCol>Status:</IonCol>
        {getStatusLabel(status)}
      </IonRow>
      <IonRow
        className={
          styles['non-bold-header'] +
          ' ion-padding-start ion-justify-content-start'
        }
      >
        {status === AppliedRequestStatus.ACCEPTED && (
          <IonCol className="ion-no-padding">
            <span className={styles['bold-text']}>Telegram: </span>
            {telegramHandle}
            <IonIcon
              className={styles['copy-icon']}
              icon={copyOutline}
              onClick={() => {
                void navigator.clipboard.writeText(telegramHandle);
                presentInfoToast('Telegram handle copied!');
              }}
            />
            <p> Contact the poster via telegram to coordinate your meetup!</p>
          </IonCol>
        )}
      </IonRow>
    </IonGrid>
  );
}
