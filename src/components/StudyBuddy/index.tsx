import { IonCol, IonRow, IonAvatar, IonIcon } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import { facultyEnumToStr, genderEnumToStr, User } from '../../api/types';
import useInfoToast from '../../util/hooks/useInfoToast';
import styles from './styles.module.scss';

interface StudyBuddyProps {
  buddy: User;
  inCreatedRequest?: boolean;
}

export default function StudyBuddy({
  buddy,
  inCreatedRequest,
}: StudyBuddyProps) {
  const presentInfoToast = useInfoToast();
  return (
    <div className={styles['study-buddy']}>
      <IonRow className="ion-padding-start">
        <IonCol size="3">
          <IonAvatar className={styles['avatar']}>
            <img alt="profile" src={buddy.profilePhoto} />
          </IonAvatar>
        </IonCol>
        <IonCol>
          <IonRow className="ion-justify-content-center">
            <IonCol className={styles['bold']}>{buddy.name ?? ''}</IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              Y{buddy.year ?? 0}/{facultyEnumToStr(buddy.faculty) ?? ''}
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>{genderEnumToStr(buddy.gender) ?? ''}</IonCol>
          </IonRow>
          {inCreatedRequest && (
            <IonRow className="ion-justify-content-center">
              <IonCol className="ion-no-padding">
                <span className={styles['bold-text']}>Telegram: </span>
                {buddy.telegramHandle}
                <IonIcon
                  className={styles['copy-icon']}
                  icon={copyOutline}
                  onClick={() => {
                    void navigator.clipboard.writeText(buddy.telegramHandle);
                    presentInfoToast('Telegram handle copied!');
                  }}
                />
              </IonCol>
            </IonRow>
          )}
        </IonCol>
      </IonRow>
    </div>
  );
}
