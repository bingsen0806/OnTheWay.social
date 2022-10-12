import { IonItem, IonLoading } from '@ionic/react';
import { useState } from 'react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import {
  AppliedRequest,
  locationEnumToStr,
  facultyEnumToStr,
  AppliedRequestStatus,
} from '../../../../../api/types';
import { useAppDispatch } from '../../../../../redux/hooks';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import useCheckedErrorHandler from '../../../../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../../../../util/hooks/useUnknownErrorHandler';
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
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          {`${(appliedRequest.post.participants.length + 1).toString()} ${
            appliedRequest.post.participants.length <= 0
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
      <IonLoading isOpen={isLoading}></IonLoading>
    </IonItem>
  );
}
