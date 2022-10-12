import { IonCol, IonRow, IonAvatar } from '@ionic/react';
import { facultyEnumToStr, genderEnumToStr, User } from '../../api/types';
import styles from './styles.module.scss';

interface StudyBuddyProps {
  buddy: User;
  inCreatedRequest?: boolean;
}

export default function StudyBuddy({
  buddy,
  inCreatedRequest,
}: StudyBuddyProps) {
  return (
    <div className={styles['study-buddy']}>
      <IonRow>
        <IonCol size="3">
          <IonAvatar className={styles['avatar']}>
            <img alt="profile" src={buddy.profilePhoto} />
          </IonAvatar>
        </IonCol>
        <IonCol>
          <IonRow className="ion-padding-start ion-justify-content-center">
            <IonCol className={styles['bold']}>{buddy.name ?? ''}</IonCol>
          </IonRow>
          <IonRow className="ion-padding-start ion-justify-content-center">
            <IonCol>
              Y{buddy.year ?? 0}/{facultyEnumToStr(buddy.faculty) ?? ''}
            </IonCol>
          </IonRow>
          <IonRow className="ion-padding-start ion-justify-content-center">
            <IonCol>{genderEnumToStr(buddy.gender) ?? ''}</IonCol>
          </IonRow>
        </IonCol>
      </IonRow>
    </div>
  );
}
