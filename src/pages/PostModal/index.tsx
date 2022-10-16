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
import { locationEnumToStr, Post } from '../../api/types';
import { arrowBackOutline } from 'ionicons/icons';
import PostDetails from '../../components/PostDetails';
import AboutPoster from '../../components/AboutPoster';
import OtherStudyBuddies from '../../components/OtherStudyBuddies';
import {
  createAppliedRequest,
  deleteAppliedRequest,
} from '../../api/appliedRequests';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { removePost } from '../../redux/slices/postsSlice';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase';
import { reloadInitialData } from '../../redux/slices/homeSlice';
import useInfoToast from '../../util/hooks/useInfoToast';
import ButtonSpinner from '../../components/ButtonSpinner';
import styles from './styles.module.scss';
import { ErrorType } from '../../api/errors';
import useErrorToast from '../../util/hooks/useErrorToast';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: ((callback: () => void) => void) | (() => void);
  applyPost: Post;
}

// export const mockCreatedRequest: CreatedRequest = {
//   post: mockPost,
//   applicants: [mockUser2, mockUser3],
// };

export default function PostModal({
  isOpen,
  onClose,
  applyPost,
}: ApplyModalProps) {
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const [presentAlert] = useIonAlert();
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentInfoToast = useInfoToast();
  const presentErrorToast = useErrorToast();

  function handleApply(postId: string) {
    setIsLoading(true);
    createAppliedRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          switch (resp.message) {
            case ErrorType.USER_PROFILE_NOT_CREATED:
              onClose(() => handleCheckedError(resp.message));
              return;
            case ErrorType.POST_ALREADY_APPLIED:
              presentInfoToast('You have applied for this post.');
              setIsApplied(true);
              void dispatch(reloadInitialData());
              return;
            case ErrorType.POST_NOT_FOUND:
              presentErrorToast(
                'Unable to apply to post. It may have been deleted.'
              );
              onCloseAction();
              return;
            default:
              handleCheckedError(resp.message);
          }
        } else {
          logEvent(analytics, 'apply_post');
          setIsApplied(true);
          presentInfoToast('Successfully applied!');
          void dispatch(reloadInitialData());
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function sendCancellationRequest(postId: string) {
    setIsLoading(true);
    deleteAppliedRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          setIsApplied(false);
          presentInfoToast('Study application cancelled');
          logEvent(analytics, 'cancel_post_application');
          void dispatch(reloadInitialData());
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onCloseAction() {
    onClose(() => {
      if (isApplied) {
        dispatch(removePost(applyPost));
      }
    });
  }

  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={onCloseAction}
      className={styles['modal-container']}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              fill="clear"
              color="dark"
              onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
                event.stopPropagation();
                onCloseAction();
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
        <OtherStudyBuddies studyBuddies={applyPost.participants} />
        <AboutPoster poster={applyPost?.poster} />
        {isApplied ? (
          <IonButton
            className="ion-padding-horizontal"
            fill="outline"
            color="danger"
            expand="block"
            onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
              event.stopPropagation();
              if (isLoading) {
                return;
              }
              void presentAlert({
                header: 'Confirm cancelling study application?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                  },
                  {
                    text: 'Confirm',
                    role: 'confirm',
                    handler: () => {
                      sendCancellationRequest(applyPost.id);
                    },
                  },
                ],
              });
            }}
          >
            {isLoading ? <ButtonSpinner /> : 'Cancel'}
          </IonButton>
        ) : (
          <IonButton
            className="ion-padding-horizontal"
            expand="block"
            color="primary"
            onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
              event.stopPropagation();
              if (isLoading) {
                return;
              }
              void presentAlert({
                header: 'Confirm Applying?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                  },
                  {
                    text: 'Apply',
                    role: 'confirm',
                    handler: () => {
                      handleApply(applyPost.id);
                    },
                  },
                ],
              });
            }}
          >
            {isLoading ? <ButtonSpinner /> : 'Apply'}
          </IonButton>
        )}
      </IonContent>
    </IonModal>
  );
}
