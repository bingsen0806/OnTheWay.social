import { IonItem } from '@ionic/react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
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
import AppliedPostStatusModal from '../../../../AppliedPostStatusModal';
import styles from '../styles.module.scss';

interface AppliedRequestListItemProps {
  appliedRequest: AppliedRequest;
}

export default function AppliedRequestListItem({
  appliedRequest,
}: AppliedRequestListItemProps) {
  const [isModalOpen, setIsModalOpen] =
    useStateWithCallbackLazy<boolean>(false);

  function closeModal(callback: () => void) {
    setIsModalOpen(false, callback);
  }

  return (
    <IonItem
      button
      onClick={() => {
        setIsModalOpen(true, () => {
          return;
        });
      }}
    >
      {appliedRequest.status === AppliedRequestStatus.ACCEPTED ? (
        <div className={styles['success-line']} />
      ) : (
        <div className={styles['alert-line']} />
      )}
      <div className={styles['post-container']}>
        <p className={styles['post-text']}>
          {locationEnumToStr(appliedRequest.post.location)}
        </p>
        <p className={styles['post-text']}>
          {convertDateToDateStr(appliedRequest.post.startDateTime)}
          {', '}
          {convertDateRangeToTimeRangeStr(
            appliedRequest.post.startDateTime,
            appliedRequest.post.endDateTime
          )}
        </p>
        <p className={styles['post-text']}>
          {`${appliedRequest.post.participants.length.toString()} ${
            appliedRequest.post.participants.length <= 1
              ? 'attendee'
              : 'attendees'
          }`}
        </p>
        <br />
        <p className={styles['post-text']}>{appliedRequest.post.description}</p>
        <br />
        <p className={styles['post-text']}>{appliedRequest.post.poster.name}</p>
        <p className={styles['post-text']}>
          Y{appliedRequest.post.poster.year},
          {facultyEnumToStr(appliedRequest.post.poster.faculty)}
        </p>
      </div>

      <AppliedPostStatusModal
        isOpen={isModalOpen}
        onClose={closeModal}
        appliedRequest={appliedRequest}
      />
    </IonItem>
  );
}
