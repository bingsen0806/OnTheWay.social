import { IonItem } from '@ionic/react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import {
  AppliedRequest,
  locationEnumToStr,
  facultyEnumToStr,
  AppliedRequestStatus,
} from '../../../../../api/types';
import LocationImage from '../../../../../components/LocationImage';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import AppliedPostModal from '../../../../AppliedPostModal';
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
      detail={false}
      className={styles['item-container']}
    >
      {appliedRequest.status === AppliedRequestStatus.ACCEPTED ? (
        <div className={styles['success-line']} />
      ) : (
        <div className={styles['alert-line']} />
      )}
      <div className="ion-padding-top">
        <h3 className="ion-no-margin">
          {locationEnumToStr(appliedRequest.post.location)}
        </h3>
        <p className={styles['key-details-text']}>
          {convertDateToDateStr(appliedRequest.post.startDateTime)}
        </p>
        <p className={styles['key-details-text']}>
          {convertDateRangeToTimeRangeStr(
            appliedRequest.post.startDateTime,
            appliedRequest.post.endDateTime
          )}
        </p>
        <br />
        <p className={styles['post-text']}>{appliedRequest.post.poster.name}</p>
        <p className={styles['margin']}>
          Y{appliedRequest.post.poster.year},{' '}
          {facultyEnumToStr(appliedRequest.post.poster.faculty)}
        </p>
      </div>
      <div slot="end">
        <LocationImage location={appliedRequest.post.location}></LocationImage>
      </div>

      <AppliedPostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        appliedRequest={appliedRequest}
      />
    </IonItem>
  );
}
