import { IonAvatar, IonButton, IonCol, IonLoading, IonRow } from '@ionic/react';
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

interface SingleApplicantProps {
  postId: string;
  applicant: User;
  addParticipantToCreatedRequest: (participant: User) => void;
}

// export const mockPoster: User = {
//   id: "testid1",
//   name: "Chun Yong",
//   gender: Gender.MALE,
//   faculty: Faculty.COMPUTING,
//   telegramHandle: "chunyonggg",
//   year: 4,
//   profilePhoto:
//     "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
//   thumbnailPhoto:
//     "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
// };

// export const mockUser2: User = {
//   id: "testid2",
//   name: "Bing Sen",
//   gender: Gender.MALE,
//   faculty: Faculty.BUSINESS,
//   telegramHandle: "bingsennn",
//   year: 3,
//   profilePhoto:
//     "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
//   thumbnailPhoto:
//     "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
// };

// export const mockUser3: User = {
//   id: "testid3",
//   name: "Ben",
//   gender: Gender.MALE,
//   faculty: Faculty.SCIENCE,
//   telegramHandle: "benmurphy",
//   year: 3,
//   profilePhoto:
//     "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
//   thumbnailPhoto:
//     "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
// };

export default function SingleApplicant({
  postId,
  applicant,
  addParticipantToCreatedRequest,
}: SingleApplicantProps) {
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          <img alt="profilePic" src={applicant.profilePhoto} />{' '}
          {/*TODO: Use default photo url if user does not have profile photo */}
        </IonAvatar>
      </IonCol>
      <IonCol className={styles['user-info']}>
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
            handleAccept(postId, applicant.id);
          }}
        >
          Accept
        </IonButton>
      </IonCol>
      <IonLoading isOpen={isLoading}></IonLoading>
    </IonRow>
  );
}
