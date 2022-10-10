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

interface AppliedPostStatusProps {
  isOpen: boolean;
  onClose: () => void;
  appliedRequest: AppliedRequest;
}

// export const mockAppliedRequest: AppliedRequest = {
//   post: mockPost,
//   status: AppliedRequestStatus.ACCEPTED,
// };

export default function AppliedPostStatusModal({
  isOpen,
  onClose,
  appliedRequest,
}: AppliedPostStatusProps) {
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleCancel(postId: string) {
    setIsLoading(true);
    deleteAppliedRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          setIsCancelled(true);
          dispatch(removeAppliedRequest(appliedRequest.post.id));
          onClose();
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
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Study Session @{' '}
            {locationEnumToStr(appliedRequest?.post?.location) ?? 'UNKNOWN'}
          </IonTitle>
          <IonButtons>
            <IonButton
              slot="start"
              fill="clear"
              color="dark"
              onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
                event.stopPropagation();
                onClose();
              }}
            >
              <IonIcon icon={arrowBackOutline} slot="start" />
              <p>Back</p>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <RequestStatus
          status={appliedRequest.status}
          telegramHandle={appliedRequest.post?.poster?.telegramHandle}
        />
        <PostDetails post={appliedRequest.post} />
        <AboutPoster poster={appliedRequest.post?.poster} />
        {isCancelled ? (
          <IonButton
            className="ion-padding-horizontal"
            expand="block"
            size="large"
            fill="clear"
            color="danger"
            disabled={true}
          >
            Cancelled
          </IonButton>
        ) : (
          <IonButton
            className="ion-padding-horizontal"
            expand="block"
            fill="outline"
            color="medium"
            onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
              event.stopPropagation();
              handleCancel(appliedRequest.post?.id);
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
