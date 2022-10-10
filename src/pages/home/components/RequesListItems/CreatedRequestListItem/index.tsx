import {
  IonItem,
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonLoading,
} from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { cancelRequest } from '../../../../../api/home';
import { locationEnumToStr, CreatedRequest } from '../../../../../api/types';
import { analytics } from '../../../../../firebase';
import { useAppDispatch } from '../../../../../redux/hooks';
import { removeCreatedRequest } from '../../../../../redux/slices/homeSlice';
import { requestReloadOfPosts } from '../../../../../redux/slices/postsSlice';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import useCheckedErrorHandler from '../../../../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../../../../util/hooks/useUnknownErrorHandler';
import CreatedPostModal from '../../../../CreatedPostModal';
import styles from '../styles.module.scss';

interface CreatedRequestListItemProps {
  createdRequest: CreatedRequest;
}

export default function CreatedRequestListItem({
  createdRequest,
}: CreatedRequestListItemProps) {
  const [isModalOpen, setIsModalOpen] =
    useStateWithCallbackLazy<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();

  function closeModal(callback: () => void) {
    setIsModalOpen(false, callback);
  }

  function sendCancellationRequest() {
    setIsLoading(true);
    cancelRequest(createdRequest.post.id)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          dispatch(removeCreatedRequest(createdRequest.post.id));
          // TODO: remove this line when backend dosnet send my own posts back in posts page
          dispatch(requestReloadOfPosts());
          logEvent(analytics, 'delete_post');
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
      onClick={() =>
        setIsModalOpen(true, () => {
          return;
        })
      }
    >
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
              {`${(createdRequest.post.participants.length + 1).toString()} ${
                createdRequest.post.participants.length <= 0
                  ? 'attendee'
                  : 'attendees'
              }`}
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
      <CreatedPostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        createdRequest={createdRequest}
      />
      <IonLoading isOpen={isLoading}></IonLoading>
    </IonItem>
  );
}
