import { IonItem } from '@ionic/react';
import { useState } from 'react';
import { locationEnumToStr, CreatedRequest } from '../../../../../api/types';
import LocationImage from '../../../../../components/LocationImage';
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
    <IonItem
      button
      onClick={() => setIsModalOpen(true)}
      className={styles['item-container']}
      detail={false}
    >
      {createdRequest.applicants.length > 0 && (
        <div className={styles['alert-line']} />
      )}
      {createdRequest.post.participants.length > 0 &&
        createdRequest.applicants.length === 0 && (
          <div className={styles['success-line']} />
        )}
      <div slot="start" className="ion-padding-top">
        <h3 className="ion-no-margin">
          {locationEnumToStr(createdRequest.post.location)}
        </h3>
        <p className={styles['key-details-text']}>
          {convertDateToDateStr(createdRequest.post.startDateTime)}
        </p>
        <p className={styles['key-details-text']}>
          {convertDateRangeToTimeRangeStr(
            createdRequest.post.startDateTime,
            createdRequest.post.endDateTime
          )}
        </p>
        {createdRequest.post.description && (
          <p className={styles['post-text']}>
            Description: {createdRequest.post.description}
          </p>
        )}

        <br />
        <p
          className={
            createdRequest.applicants.length > 0
              ? styles['applicant-number-not-zero-text']
              : ''
          }
        >
          {createdRequest.applicants.length} pending applicants
        </p>
      </div>
      <div slot="end">
        <LocationImage location={createdRequest.post.location}></LocationImage>
      </div>
      <CreatedPostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        createdRequest={createdRequest}
      />
    </IonItem>
  );
}
