import {
  IonAvatar,
  IonButton,
  IonCol,
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
  const presentInfoToast = useInfoToast();
  function handleAccept(postId: string, applicantUserId: string) {
    setIsLoading(true);
    responseAppliedRequest(
      postId,
      applicantUserId,
      AppliedRequestStatus.ACCEPTED
    )
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
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
    <IonRow className="ion-padding-start ion-justify-content-center">
      <IonCol size="3">
        <IonAvatar className={styles['avatar']}>
          <img alt="profilePic" src={applicant.thumbnailPhoto} />{' '}
        </IonAvatar>
      </IonCol>
      <IonCol size="5" className={styles['user-info']}>
        <IonRow className={styles['bold']}>
          {applicant.name ?? 'No Name'}
        </IonRow>
        <IonRow>
          Y{applicant.year ?? 0}/
          {facultyEnumToStr(applicant.faculty) ?? 'unknown faculty'}
        </IonRow>
        <IonRow>{genderEnumToStr(applicant.gender) ?? 'unknown gender'}</IonRow>
      </IonCol>
      <IonCol size="4" className={styles['accept-col']}>
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
  );
}
