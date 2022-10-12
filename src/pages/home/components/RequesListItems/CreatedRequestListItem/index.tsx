import { IonItem, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useState } from 'react';
import { locationEnumToStr, CreatedRequest } from '../../../../../api/types';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import CreatedPostModal from '../../../../CreatedPostModal';
import styles from '../styles.module.scss';

interface CreatedRequestListItemProps {
  createdRequest: CreatedRequest;
}

export default function CreatedRequestListItem({
  createdRequest,
}: CreatedRequestListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function closeModal(callback: () => void) {
    setIsModalOpen(false);
    setTimeout(callback, 200);
  }

  return (
    <IonItem button onClick={() => setIsModalOpen(true)}>
      {createdRequest.applicants.length > 0 && (
        <div className={styles['alert-line']} />
      )}
      <IonGrid>
        <IonRow className="ion-justify-content-between">
          <IonCol>
            <p className={styles['post-text']}>
              {locationEnumToStr(createdRequest.post.location)}
            </p>
            <p className={styles['post-text']}>
              {convertDateToDateStr(createdRequest.post.startDateTime)}
              {', '}
              {convertDateRangeToTimeRangeStr(
                createdRequest.post.startDateTime,
                createdRequest.post.endDateTime
              )}
            </p>
            <p className={styles['post-text']}>
              {`${createdRequest.post.participants.length.toString()} ${
                createdRequest.post.participants.length <= 0
                  ? 'attendee'
                  : 'attendees'
              }`}
            </p>
            <br />
            <p className={styles['post-text']}>
              Description: {createdRequest.post.description}
            </p>
            <br />
          </IonCol>
          <IonCol
            size="4"
            sizeLg="auto"
            className={styles['created-request-col']}
          >
            <b className="ion-padding-bottom">
              {createdRequest.applicants.length} pending applicants
            </b>
          </IonCol>
        </IonRow>
      </IonGrid>
      <CreatedPostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        createdRequest={createdRequest}
      />
    </IonItem>
  );
}
