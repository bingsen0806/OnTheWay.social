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
import { useEffect, useState } from 'react';
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
import { useAuthState } from '../../util/authentication';
import UnauthenticatedPostDetails from '../../components/UnauthenticatedPostDetails';
import { useHistory, useLocation } from 'react-router';

interface ApplyModalProps {
  onClose?: ((callback: () => void) => void) | (() => void);
  applyPost: Post;
  infoOnly?: boolean;
}

export default function PostInformation({
  onClose,
  applyPost,
  infoOnly,
}: ApplyModalProps) {
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const [presentAlert] = useIonAlert();
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentInfoToast = useInfoToast();
  const presentErrorToast = useErrorToast();
  const { isAuthenticated } = useAuthState();
  const isMobile = getPlatforms().includes('mobile');
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (!location.search.includes('modal=true') && isMobile) {
      onCloseAction();
    }
  }, [location]);

  function handleApply(postId: string) {
    setIsLoading(true);
    createAppliedRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          switch (resp.message) {
            case ErrorType.USER_PROFILE_NOT_CREATED:
              onClose && onClose(() => handleCheckedError(resp.message));
              !onClose && handleCheckedError(resp.message);
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
          const callback = () => {
            dispatch(removePost(applyPost));
          };
          onClose && onClose(callback);
          !onClose && callback();
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
    const callback = () => {
      if (isApplied) {
        dispatch(removePost(applyPost));
      }
      if (location.search.includes('modal=true')) {
        history.goBack();
      }
    };
    onClose && onClose(callback);
    !onClose && callback();
  }

  return (
    <>
      {isMobile ||
        (infoOnly && (
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
                Study Session @{' '}
                {locationEnumToStr(applyPost.location) ?? 'UNKNOWN'}
              </IonTitle>
            </IonToolbar>
          </IonHeader>
        ))}
      <IonGrid>
        <IonRow className="ion-justify-content-center">
          <IonCol sizeMd="8" sizeLg="11">
            <PostDetails post={applyPost} />
            {!isAuthenticated && (
              <UnauthenticatedPostDetails closeDialog={onClose} />
            )}
            {isAuthenticated && (
              <>
                {!infoOnly && applyPost.participants.length > 0 && (
                  <OtherStudyBuddies studyBuddies={applyPost.participants} />
                )}
                <AboutPoster poster={applyPost?.poster} />
                {infoOnly ? null : isApplied ? (
                  <IonButton
                    className={`ion-padding-horizontal ion-margin-top ${
                      isMobile ? styles['cancel-button'] : ''
                    }`}
                    fill="outline"
                    color="danger"
                    expand="block"
                    onClick={(
                      event: React.MouseEvent<HTMLIonButtonElement>
                    ) => {
                      event.stopPropagation();
                      if (isLoading) {
                        return;
                      }
                      void presentAlert({
                        header: 'Confirm cancelllation?',
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
                    className={
                      isMobile
                        ? `${styles['accept-button']} ion-padding-horizontal ion-margin-top`
                        : `${styles['accept-button']} ${styles['accept-button-top']} ion-padding-horizontal ion-margin-top`
                    }
                    expand="block"
                    color="primary"
                    onClick={(
                      event: React.MouseEvent<HTMLIonButtonElement>
                    ) => {
                      event.stopPropagation();
                      if (isLoading) {
                        return;
                      }
                      void presentAlert({
                        header: 'Confirm Application?',
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
              </>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
}
