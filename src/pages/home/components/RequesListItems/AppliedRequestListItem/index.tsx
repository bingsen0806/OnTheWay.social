import { IonItem, IonLabel, IonButton, IonLoading } from '@ionic/react';
import { useState } from 'react';
import { deleteAppliedRequest } from '../../../../../api/appliedRequests';
import {
  AppliedRequest,
  locationEnumToStr,
  facultyEnumToStr,
  AppliedRequestStatus,
} from '../../../../../api/types';
import { useAppDispatch } from '../../../../../redux/hooks';
import { removeAppliedRequest } from '../../../../../redux/slices/homeSlice';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import useCheckedErrorHandler from '../../../../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../../../../util/hooks/useUnknownErrorHandler';
import AppliedPostStatus from '../../../../appliedPostStatus';
import styles from '../styles.module.scss';

interface AppliedRequestListItemProps {
  appliedRequest: AppliedRequest;
}

export default function AppliedRequestListItem({
  appliedRequest,
}: AppliedRequestListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function closeModal() {
    setIsModalOpen(false);
    console.log('close applied request modal');
  }

  function sendCancellationRequest() {
    setIsLoading(true);
    deleteAppliedRequest(appliedRequest.post.id)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          dispatch(removeAppliedRequest(appliedRequest));
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <IonItem
      button
      onClick={() => {
        setIsModalOpen(true);
      }}
    >
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
          onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
            event.stopPropagation();
            sendCancellationRequest();
          }}
        >
          Cancel
        </IonButton>
      </div>
      <AppliedPostStatus
        isOpen={isModalOpen}
        onClose={closeModal}
        appliedRequest={appliedRequest}
      />
      <IonLoading isOpen={isLoading}></IonLoading>
    </IonItem>
  );
}
