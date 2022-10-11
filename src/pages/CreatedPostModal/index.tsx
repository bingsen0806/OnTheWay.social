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
import { CreatedRequest, locationEnumToStr, User } from '../../api/types';
import { arrowBackOutline } from 'ionicons/icons';
import PostDetails from '../../components/PostDetails';
import ApplicantList from '../../components/ApplicantList';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { useState } from 'react';
import { cancelRequest } from '../../api/home';
import { useAppDispatch } from '../../redux/hooks';
import {
  removeCreatedRequest,
  replaceCreatedRequest,
} from '../../redux/slices/homeSlice';
import { analytics } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import { requestReloadOfPosts } from '../../redux/slices/postsSlice';
import OtherStudyBuddies from '../../components/OtherStudyBuddies';

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
  // temp state of created request, any changes will be synced up with redux when the modal is closed
  const [createdRequestState, setCreatedRequestState] =
    useState<CreatedRequest>(
      JSON.parse(JSON.stringify(createdRequest)) as CreatedRequest
    );
  // simple flag to determine if we should request reload of post data if cretaed request is changed
  const [createdRequestWasEdited, setCreatedRequestWasEdited] =
    useState<boolean>(false);
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
            // TODO: remove this line when backend doesnt send my own posts back in posts page
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

  function addParticipantToCreatedRequest(participant: User) {
    const newCreatedRequest = JSON.parse(
      JSON.stringify(createdRequestState)
    ) as CreatedRequest;
    newCreatedRequest.applicants = newCreatedRequest.applicants.filter(
      (applicant) => applicant.id !== participant.id
    );
    newCreatedRequest.post.participants.push(participant);
    setCreatedRequestState(newCreatedRequest);
    setCreatedRequestWasEdited(true);
  }

  function closeModal() {
    onClose(() => {
      if (createdRequestWasEdited) {
        dispatch(replaceCreatedRequest(createdRequestState));
        dispatch(requestReloadOfPosts());
      }
    });
  }

  return (
    <IonModal isOpen={isOpen} onWillDismiss={closeModal}>
      <IonHeader>
        <IonToolbar>
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
          <IonTitle>
            Study Session @{' '}
            {locationEnumToStr(createdRequestState?.post?.location) ??
              'UNKNOWN'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <PostDetails post={createdRequestState.post} />
        <OtherStudyBuddies
          inCreatedRequest
          studyBuddies={createdRequestState.post.participants}
        ></OtherStudyBuddies>
        <ApplicantList
          postId={createdRequestState.post.id}
          applicants={createdRequestState.applicants}
          addParticipantToCreatedRequest={addParticipantToCreatedRequest}
        />
        <IonButton
          className="ion-padding-horizontal ion-margin-top"
          expand="block"
          color="medium"
          onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
            event.stopPropagation();
            void handleDelete(createdRequestState.post?.id);
          }}
        >
          Delete Post
        </IonButton>
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonContent>
    </IonModal>
  );
}
