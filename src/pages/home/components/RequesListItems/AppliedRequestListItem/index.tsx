import { IonItem, IonLabel, IonButton } from '@ionic/react';
import { cancelRequest } from '../../../../../api/home';
import {
  AppliedRequest,
  locationEnumToStr,
  facultyEnumToStr,
  AppliedRequestStatus,
} from '../../../../../api/types';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import styles from '../styles.module.scss';

interface AppliedRequestListItemProps {
  appliedRequest: AppliedRequest;
}

export default function AppliedRequestListItem({
  appliedRequest,
}: AppliedRequestListItemProps) {
  function sendCancellationRequest() {
    void cancelRequest(appliedRequest.post.id);
    // TODO: error handling
  }

  return (
    <IonItem>
      <div className={styles['post-container']}>
        <p className={styles['post-text']}>
          Location: {locationEnumToStr(appliedRequest.post.location)}
        </p>
        <p className={styles['post-text']}>
          When: {convertDateToDateStr(appliedRequest.post.startDateTime)}
          {', '}
          {convertDateRangeToTimeRangeStr(
            appliedRequest.post.startDateTime,
            appliedRequest.post.endDateTime
          )}
        </p>
        <p className={styles['post-text']}>
          {appliedRequest.post.participants.length + 1} /{' '}
          {appliedRequest.post.personCapacity} pax
        </p>
        <p className={styles['post-text']}>
          Description: {appliedRequest.post.description}
        </p>
        <br></br>
        <p className={styles['post-text']}>
          {appliedRequest.post.poster.name}, Y{appliedRequest.post.poster.year}{' '}
          {facultyEnumToStr(appliedRequest.post.poster.faculty)}
        </p>
      </div>
      <div slot="end" className={styles['status-container']}>
        {appliedRequest.status === AppliedRequestStatus.ACCEPTED ? (
          <IonLabel color="success" className="ion-padding-bottom">
            Accepted!
          </IonLabel>
        ) : (
          <IonLabel color="warning" className="ion-padding-bottom">
            Pending
          </IonLabel>
        )}
        <IonButton
          color="light"
          className="ion-no-margin"
          onClick={sendCancellationRequest}
        >
          Cancel
        </IonButton>
      </div>
    </IonItem>
  );
}
