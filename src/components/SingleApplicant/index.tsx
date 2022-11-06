import {
  getPlatforms,
  IonAvatar,
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
  useIonAlert,
} from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import { responseAppliedRequest } from '../../api/appliedRequests';
import {
  AppliedRequestStatus,
  facultyEnumToStr,
  genderEnumToStr,
  User,
} from '../../api/types';
import { analytics } from '../../firebase';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import styles from './styles.module.scss';
import useInfoToast from '../../util/hooks/useInfoToast';
import ButtonSpinner from '../ButtonSpinner';
import { ErrorType } from '../../api/errors';
import useErrorToast from '../../util/hooks/useErrorToast';
import { useHistory } from 'react-router';
import PublicProfileModal from '../../pages/PublicProfileModal';
interface SingleApplicantProps {
  postId: string;
  applicant: User;
  addParticipantToCreatedRequest: (participant: User) => void;
}
export default function SingleApplicant({
  postId,
  applicant,
  addParticipantToCreatedRequest,
}: SingleApplicantProps) {
  const [presentAlert] = useIonAlert();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const presentInfoToast = useInfoToast();
  const presentErrorToast = useErrorToast();
  const history = useHistory();
  const isMobile = getPlatforms().includes('mobile');
  const closeModal = () => setIsOpen(false);

  const openModal = () => {
    if (isMobile) {
      setIsOpen(true);
    } else {
      history.push({
        pathname: '/profile',
        search: `?userId=${applicant.id}`,
        state: { user: applicant },
      });
    }
  };

  function handleAccept(postId: string, applicantUserId: string) {
    setIsLoading(true);
    responseAppliedRequest(
      postId,
      applicantUserId,
      AppliedRequestStatus.ACCEPTED
    )
      .then((resp) => {
        if (!resp.success) {
          switch (resp.message) {
            case ErrorType.USER_NOT_FOUND:
              presentErrorToast('User does not exist anymore.');
              return;
            case ErrorType.APPLICATION_TO_POST_DELETED:
              presentErrorToast(
                'This user is no longer applying to this study session.'
              );
              return;
            default:
              handleCheckedError(resp.message);
          }
        } else {
          presentInfoToast('Successfully accepted!');
          addParticipantToCreatedRequest(applicant);
          logEvent(analytics, 'accept_post_application');
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
    <>
      {isMobile && (
        <PublicProfileModal
          isOpen={isOpen}
          onClose={closeModal}
          user={applicant}
        />
      )}
      <IonItem
        lines="none"
        button
        className="ion-no-margin ion-no-padding"
        detail={false}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <IonGrid>
          <IonRow>
            <IonCol size="3" sizeMd="2" onClick={openModal}>
              <IonAvatar className={styles['avatar']}>
                <img alt="profilePic" src={applicant.thumbnailPhoto} />{' '}
              </IonAvatar>
            </IonCol>
            <IonCol size="5" className={styles['user-info']}>
              <div className={styles['username']} onClick={openModal}>
                <p>{applicant.name}</p>
              </div>
              Y{applicant.year ?? 0}/{facultyEnumToStr(applicant.faculty)}
              <br />
              {genderEnumToStr(applicant.gender)}
            </IonCol>
            <IonCol size="4" sizeLg="3" className={styles['accept-col']}>
              <IonButton
                shape="round"
                fill="solid"
                size="small"
                onClick={(event: React.MouseEvent<HTMLIonButtonElement>) => {
                  event.stopPropagation();
                  if (isLoading) {
                    return;
                  }
                  void presentAlert({
                    header: 'Confirm Accept Applicant?',
                    message:
                      'Once accepted, telegram details of the applicant will be shown, and they will be notified with your telegram details as well.',
                    buttons: [
                      {
                        text: 'Cancel',
                        role: 'cancel',
                      },
                      {
                        text: 'Accept',
                        role: 'confirm',
                        handler: () => {
                          handleAccept(postId, applicant.id);
                        },
                      },
                    ],
                  });
                }}
              >
                {isLoading ? <ButtonSpinner /> : 'Accept'}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  );
}
