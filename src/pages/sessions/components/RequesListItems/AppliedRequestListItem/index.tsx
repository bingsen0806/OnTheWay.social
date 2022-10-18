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
        <h3 className="ion-no-margin">
          {convertDateToDateStr(appliedRequest.post.startDateTime)}
        </h3>
        <h3 className="ion-no-margin">
          {convertDateRangeToTimeRangeStr(
            appliedRequest.post.startDateTime,
            appliedRequest.post.endDateTime
          )}
        </h3>
        <p className={styles['post-text-location']}>
          {locationEnumToStr(appliedRequest.post.location)}
        </p>
        <br />
        <p className={styles['post-text']}>{appliedRequest.post.description}</p>
        <br />
        <p className={styles['post-text']}>{appliedRequest.post.poster.name}</p>
        <p className={styles['margin']}>
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
