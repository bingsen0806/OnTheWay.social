import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react';
import { AppliedRequest, locationEnumToStr } from '../../api/types';
import { arrowBackOutline } from 'ionicons/icons';
import PostDetails from '../../components/PostDetails';
import AboutPoster from '../../components/AboutPoster';
import RequestStatus from '../../components/RequestStatus';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { useState } from 'react';
import { deleteAppliedRequest } from '../../api/appliedRequests';
import { useAppDispatch } from '../../redux/hooks';
import { removeAppliedRequest } from '../../redux/slices/homeSlice';
import useInfoToast from '../../util/hooks/useInfoToast';
import { reloadInitialPostsData } from '../../redux/slices/postsSlice';
import ButtonSpinner from '../../components/ButtonSpinner';
import styles from './styles.module.scss';
import { ErrorType } from '../../api/errors';
import { removeNotification } from '../../redux/slices/notificationsSlice';

interface AppliedPostModalProps {
  isOpen: boolean;
  onClose: (callback: () => void) => void;
  appliedRequest: AppliedRequest;
}

export default function AppliedPostModal({
  isOpen,
  onClose,
  appliedRequest,
}: AppliedPostModalProps) {
  const [presentAlert] = useIonAlert();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentInfoToast = useInfoToast();

  function handleCancel() {
    setIsLoading(true);
    deleteAppliedRequest(appliedRequest.post.id)
      .then((resp) => {
        if (!resp.success) {
          switch (resp.message) {
            case ErrorType.POST_NOT_FOUND:
              presentInfoToast('The post has already been deleted');
              setIsCancelled(true);
              void dispatch(reloadInitialPostsData());
              closeModal();
              return;
            case ErrorType.APPLIED_REQUEST_NOT_FOUND:
              presentInfoToast('You have already cancelled this application.');
              setIsCancelled(true);
              void dispatch(reloadInitialPostsData());
              closeModal();
              return;
            default:
              handleCheckedError(resp.message);
          }
        } else {
          setIsCancelled(true);
          presentInfoToast('Successfully cancelled!');
          void dispatch(reloadInitialPostsData());
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function closeModal() {
    onClose(() => {
      if (isCancelled) {
        dispatch(removeNotification(appliedRequest.post.id));
        dispatch(removeAppliedRequest(appliedRequest.post.id));
      }
    });
  }

  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={closeModal}
      className={styles['modal-container']}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Study Session @{' '}
            {locationEnumToStr(appliedRequest?.post?.location) ?? 'UNKNOWN'}
          </IonTitle>
          <IonButtons slot="start">
            <IonButton
              fill="clear"
              color="dark"
              onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
                event.stopPropagation();
                closeModal();
              }}
            >
              <IonIcon icon={arrowBackOutline} slot="start" />
              <p>Back</p>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!isCancelled && (
          <RequestStatus
            status={appliedRequest.status}
            telegramHandle={appliedRequest.post?.poster?.telegramHandle}
          />
        )}
        <PostDetails post={appliedRequest.post} />
        <AboutPoster poster={appliedRequest.post?.poster} />
        {!isCancelled && (
          <IonButton
            className="ion-padding-horizontal"
            expand="block"
            fill="outline"
            color="danger"
            onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
              event.stopPropagation();
              if (isLoading) {
                return;
              }
              void presentAlert({
                header: 'Confirm Cancel Application?',
                message: 'This action is irreversible',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                  },
                  {
                    text: 'Confirm',
                    role: 'confirm',
                    handler: handleCancel,
                  },
                ],
              });
            }}
          >
            {isLoading ? <ButtonSpinner /> : 'Cancel'}
          </IonButton>
        )}
      </IonContent>
    </IonModal>
  );
}
