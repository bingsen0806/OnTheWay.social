import {
  getPlatforms,
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
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
import { ErrorType } from '../../api/errors';
import { removeNotification } from '../../redux/slices/notificationsSlice';
import OtherStudyBuddies from '../../components/OtherStudyBuddies';

interface AppliedPostModalProps {
  onClose?: (callback: () => void) => void;
  appliedRequest: AppliedRequest;
}

export default function AppliedPostContent({
  onClose,
  appliedRequest,
}: AppliedPostModalProps) {
  const [presentAlert] = useIonAlert();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentInfoToast = useInfoToast();
  const isMobile = getPlatforms().includes('mobile');

  function handleCancel() {
    setIsLoading(true);
    deleteAppliedRequest(appliedRequest.post.id)
      .then((resp) => {
        if (!resp.success) {
          switch (resp.message) {
            case ErrorType.POST_NOT_FOUND:
              presentInfoToast('The post has already been deleted');
              void dispatch(reloadInitialPostsData());
              cancelAndClose();
              return;
            case ErrorType.APPLIED_REQUEST_NOT_FOUND:
              presentInfoToast('You have already cancelled this application.');
              void dispatch(reloadInitialPostsData());
              cancelAndClose();
              return;
            default:
              handleCheckedError(resp.message);
          }
        } else {
          presentInfoToast('Successfully cancelled!');
          cancelAndClose();
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

  function cancelAndClose() {
    const callback = () => {
      dispatch(removeNotification(appliedRequest.post.id));
      dispatch(removeAppliedRequest(appliedRequest.post.id));
    };
    onClose && onClose(callback);
    !onClose && callback();
  }

  return (
    <>
      {isMobile && (
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
                  onClose &&
                    onClose(() => {
                      return;
                    });
                }}
              >
                <IonIcon icon={arrowBackOutline} slot="start" />
                <p>Back</p>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}
      <IonGrid>
        <IonRow className="ion-justify-content-center">
          <IonCol sizeMd="8">
            <RequestStatus
              status={appliedRequest.status}
              telegramHandle={appliedRequest.post?.poster?.telegramHandle}
            />

            <PostDetails post={appliedRequest.post} />
            <OtherStudyBuddies
              studyBuddies={appliedRequest.post.participants}
            ></OtherStudyBuddies>
            <AboutPoster
              poster={appliedRequest.post.poster}
              post={appliedRequest.post}
            />
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
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
}
