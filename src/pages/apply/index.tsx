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
import { locationEnumToStr, Post } from '../../api/types';
import { arrowBackOutline } from 'ionicons/icons';
import PostDetails from '../../components/PostDetails';
import AboutPoster from '../../components/AboutPoster';
import OtherStudyBuddies from '../../components/OtherStudyBuddies';
import { createAppliedRequest } from '../../api/appliedRequests';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { removePost } from '../../redux/slices/postsSlice';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  applyPost: Post;
}

// export const mockCreatedRequest: CreatedRequest = {
//   post: mockPost,
//   applicants: [mockUser2, mockUser3],
// };

export default function ApplyModal({
  isOpen,
  onClose,
  applyPost,
}: ApplyModalProps) {
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleApply(postId: string) {
    setIsLoading(true);
    createAppliedRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          setIsApplied(true);
          // remove the post from the outside list of posts, since applied for it already
          dispatch(removePost(applyPost));
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
    <IonModal isOpen={isOpen} onWillDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
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
          <IonTitle>
            Study Session @ {locationEnumToStr(applyPost.location) ?? 'UNKNOWN'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <PostDetails post={applyPost} />
        <AboutPoster poster={applyPost?.poster} />
        <OtherStudyBuddies studyBuddies={applyPost.participants} />
        {isApplied ? (
          <IonButton
            className="ion-padding-horizontal"
            fill="clear"
            color="success"
            expand="block"
            disabled={true}
            size="large"
            onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
              event.stopPropagation();
              handleApply(applyPost.id);
            }}
          >
            Cancel
          </IonButton>
        ) : (
          <IonButton
            className="ion-padding-horizontal"
            expand="block"
            onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
              event.stopPropagation();
              handleApply(applyPost.id);
            }}
          >
            Apply
          </IonButton>
        )}
      </IonContent>
      <IonLoading isOpen={isLoading}></IonLoading>
    </IonModal>
  );
}
