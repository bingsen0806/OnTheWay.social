import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
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
import { useHistory } from 'react-router';
import useInfoToast from '../../util/hooks/useInfoToast';
import { reloadInitialPostsData } from '../../redux/slices/postsSlice';

interface AppliedPostStatusProps {
  isOpen: boolean;
  onClose: (callback: () => void) => void;
  appliedRequest: AppliedRequest;
}

export default function AppliedPostStatusModal({
  isOpen,
  onClose,
  appliedRequest,
}: AppliedPostStatusProps) {
  const [presentAlert] = useIonAlert();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const history = useHistory();
  const presentInfoToast = useInfoToast();
  function handleCancel() {
    setIsLoading(true);
    deleteAppliedRequest(appliedRequest.post.id)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
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
        dispatch(removeAppliedRequest(appliedRequest.post.id));
      }
    });
  }

  return (
    <IonModal isOpen={isOpen} onWillDismiss={closeModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Study Session @{' '}
            {locationEnumToStr(appliedRequest?.post?.location) ?? 'UNKNOWN'}
          </IonTitle>
          <IonButtons slot="start">
            <IonButton
              fill="clear"
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
            Cancel
          </IonButton>
        )}
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonContent>
    </IonModal>
  );
}
