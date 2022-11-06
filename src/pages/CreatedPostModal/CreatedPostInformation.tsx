import {
  getPlatforms,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react';
import { CreatedRequest, locationEnumToStr, User } from '../../api/types';
import { arrowBackOutline } from 'ionicons/icons';
import PostDetails from '../../components/PostDetails';
import ApplicantList from '../../components/ApplicantList';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { useEffect, useState } from 'react';
import { cancelRequest } from '../../api/home';
import { useAppDispatch } from '../../redux/hooks';
import {
  removeCreatedRequest,
  replaceCreatedRequest,
} from '../../redux/slices/homeSlice';
import { analytics } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import {
  reloadInitialPostsData,
  requestReloadOfPosts,
} from '../../redux/slices/postsSlice';
import OtherStudyBuddies from '../../components/OtherStudyBuddies';
import useInfoToast from '../../util/hooks/useInfoToast';
import ButtonSpinner from '../../components/ButtonSpinner';
import { ErrorType } from '../../api/errors';
import {
  removeNotification,
  replaceNotification,
} from '../../redux/slices/notificationsSlice';
import styles from './styles.module.scss';

interface PosterViewRequestProps {
  onClose?: (callback: () => void) => void;
  createdRequest: CreatedRequest;
}

export default function CreatedPostInformation({
  onClose,
  createdRequest,
}: PosterViewRequestProps) {
  const isMobile = getPlatforms().includes('mobile');
  const [presentAlert] = useIonAlert();
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const presentInfoToast = useInfoToast();
  useEffect(() => {
    setCreatedRequestState(createdRequest);
  }, [createdRequest]);
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
    const postDeleteCallback = () => {
      dispatch(removeNotification(createdRequest.post.id));
      dispatch(removeCreatedRequest(createdRequest.post.id));
      void dispatch(reloadInitialPostsData());
    };
    setIsLoading(true);
    cancelRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          switch (resp.message) {
            case ErrorType.POST_NOT_FOUND:
              presentInfoToast('Post has been deleted.');
              onClose && onClose(postDeleteCallback);
              return;
            default:
              handleCheckedError(resp.message);
          }
        } else {
          setIsLoading(false);
          logEvent(analytics, 'delete_post');
          presentInfoToast('Successfully deleted!');
          onClose && onClose(postDeleteCallback);
        }
        if (!onClose) {
          postDeleteCallback();
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function updateStoreIfEdited(wasEdited?: boolean) {
    if (createdRequestWasEdited || wasEdited) {
      dispatch(replaceNotification(createdRequestState));
      dispatch(replaceCreatedRequest(createdRequestState));
      dispatch(requestReloadOfPosts());
    }
  }

  function addParticipantToCreatedRequest(participant: User) {
    console.log('117');
    const newCreatedRequest = JSON.parse(
      JSON.stringify(createdRequestState)
    ) as CreatedRequest;
    newCreatedRequest.applicants = newCreatedRequest.applicants.filter(
      (applicant) => applicant.id !== participant.id
    );
    newCreatedRequest.post.participants.push(participant);
    setCreatedRequestState(newCreatedRequest);
    setCreatedRequestWasEdited(true);
    if (!isMobile) {
      updateStoreIfEdited(true);
    }
  }

  function closeModal() {
    onClose && onClose(updateStoreIfEdited);
  }

  return (
    <>
      {isMobile && (
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
      )}
      <IonContent fullscreen={isMobile} className={styles['no-padding']}>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="11">
              <OtherStudyBuddies
                inCreatedRequest
                studyBuddies={createdRequestState.post.participants}
              ></OtherStudyBuddies>
              <ApplicantList
                postId={createdRequestState.post.id}
                applicants={createdRequestState.applicants}
                addParticipantToCreatedRequest={addParticipantToCreatedRequest}
              />
              <PostDetails post={createdRequestState.post} />
              <IonButton
                className="ion-padding-horizontal ion-margin-vertical"
                expand="block"
                fill="outline"
                color="danger"
                onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
                  event.stopPropagation();
                  if (isLoading) {
                    return;
                  }
                  void presentAlert({
                    header: 'Warning!',
                    message:
                      'You are deleting a study session. This is irreversible',
                    buttons: [
                      {
                        text: 'Cancel',
                        role: 'cancel',
                      },
                      {
                        text: 'Delete Post',
                        role: 'confirm',
                        handler: () => {
                          void handleDelete(createdRequestState.post?.id);
                        },
                      },
                    ],
                  });
                }}
              >
                {isLoading ? <ButtonSpinner /> : 'Delete'}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
}
