import { IonItem, IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useState } from 'react';
import { cancelRequest } from '../../../../../api/home';
import { locationEnumToStr, CreatedRequest } from '../../../../../api/types';
import { useAppDispatch } from '../../../../../redux/hooks';
import { getNewPageOfCreatedRequests } from '../../../../../redux/slices/homeSlice';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import useCheckedErrorHandler from '../../../../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../../../../util/hooks/useUnknownErrorHandler';
import PosterViewRequest from '../../../../posterViewRequest';
import styles from '../styles.module.scss';

interface CreatedRequestListItemProps {
  createdRequest: CreatedRequest;
}

export default function CreatedRequestListItem({
  createdRequest,
}: CreatedRequestListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();

  function closeModal() {
    setIsModalOpen(false);
  }

  function sendCancellationRequest() {
    cancelRequest(createdRequest.post.id)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          dispatch(getNewPageOfCreatedRequests())
            .unwrap()
            .then((resp) => {
              if (!resp.success) {
                handleCheckedError(resp.message as string);
              }
            })
            .catch((error) => {
              handleUnknownError(error);
            });
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      });
  }

  return (
    <IonItem button onClick={() => setIsModalOpen(true)}>
      <IonGrid>
        <IonRow className="ion-justify-content-between">
          <IonCol>
            <p className={styles['post-text']}>
              Location: {locationEnumToStr(createdRequest.post.location)}
            </p>
            <p className={styles['post-text']}>
              When: {convertDateToDateStr(createdRequest.post.startDateTime)}
              {', '}
              {convertDateRangeToTimeRangeStr(
                createdRequest.post.startDateTime,
                createdRequest.post.endDateTime
              )}
            </p>
            <p className={styles['post-text']}>
              {createdRequest.post.participants.length + 1} /{' '}
              {createdRequest.post.personCapacity} pax
            </p>
            <p className={styles['post-text']}>
              Description: {createdRequest.post.description}
            </p>
          </IonCol>
          <IonCol
            size="4"
            sizeLg="auto"
            className={styles['created-request-col']}
          >
            <b className="ion-padding-bottom ion-text-center">
              {createdRequest.applicants.length} pending applicants
            </b>
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
          </IonCol>
        </IonRow>
      </IonGrid>
      <PosterViewRequest
        isOpen={isModalOpen}
        onClose={closeModal}
        createdRequest={createdRequest}
      />
    </IonItem>
  );
}
