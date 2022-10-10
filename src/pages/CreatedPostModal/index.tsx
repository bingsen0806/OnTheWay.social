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
import { CreatedRequest, locationEnumToStr } from '../../api/types';
import { arrowBackOutline } from 'ionicons/icons';
import PostDetails from '../../components/PostDetails';
import ApplicantList from '../../components/ApplicantList';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { useState } from 'react';
import { cancelRequest } from '../../api/home';
import { useAppDispatch } from '../../redux/hooks';
import { removeCreatedRequest } from '../../redux/slices/homeSlice';
import { analytics } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import { requestReloadOfPosts } from '../../redux/slices/postsSlice';

interface PosterViewRequestProps {
  isOpen: boolean;
  onClose: (callback: () => void) => void;
  createdRequest: CreatedRequest;
}

function getParticipantsFromCreatedRequest(createdRequest: CreatedRequest) {
  if (!createdRequest.post || !createdRequest.post.participants) {
    return [];
  }
  return createdRequest.post.participants.map((user) => user.id);
}

export default function CreatedPostModal({
  isOpen,
  onClose,
  createdRequest,
}: PosterViewRequestProps) {
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleDelete(postId: string) {
    setIsLoading(true);
    cancelRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          setIsLoading(false);
          logEvent(analytics, 'delete_post');
          onClose(() => {
            dispatch(removeCreatedRequest(createdRequest.post.id));
            // TODO: remove this line when backend dosnet send my own posts back in posts page
            dispatch(requestReloadOfPosts());
          });
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
    <IonModal
      isOpen={isOpen}
      onWillDismiss={() =>
        onClose(() => {
          return;
        })
      }
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              fill="clear"
              color="dark"
              onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
                event.stopPropagation();
                onClose(() => {
                  return;
                });
              }}
            >
              <IonIcon icon={arrowBackOutline} slot="start" />
              <p>Back</p>
            </IonButton>
          </IonButtons>
          <IonTitle>
            Study Session @{' '}
            {locationEnumToStr(createdRequest?.post?.location) ?? 'UNKNOWN'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <PostDetails post={createdRequest.post} />
        <ApplicantList
          postId={createdRequest.post.id}
          applicants={createdRequest.applicants}
          participants={getParticipantsFromCreatedRequest(createdRequest)}
        />
        <IonButton
          className="ion-padding-horizontal ion-margin-top"
          expand="block"
          color="medium"
          onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
            event.stopPropagation();
            void handleDelete(createdRequest.post?.id);
          }}
        >
          Delete Post
        </IonButton>
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonContent>
    </IonModal>
  );
}
