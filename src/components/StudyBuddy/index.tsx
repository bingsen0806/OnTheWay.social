import { IonCol, IonRow, IonAvatar, IonIcon } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import { useState } from 'react';
import { facultyEnumToStr, genderEnumToStr, User } from '../../api/types';
import PublicProfileModal from '../../pages/PublicProfileModal';
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
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  return (
    <div className={styles['study-buddy']}>
      <PublicProfileModal isOpen={isOpen} onClose={closeModal} user={buddy} />
      <IonRow className="ion-padding-start ion-justify-content-center ion-align-items-center">
        <IonCol size="3" sizeMd="6" onClick={openModal}>
          <IonAvatar className={styles['avatar']}>
            <img alt="profile" src={buddy.thumbnailPhoto} />
          </IonAvatar>
        </IonCol>
        <IonCol>
          <IonCol className={styles['hover']} onClick={openModal}>
            <IonRow className={styles['bold']}>{buddy.name}</IonRow>
            <IonRow className={styles['light']}>
              Y{buddy.year}/{facultyEnumToStr(buddy.faculty)}
            </IonRow>
            <IonRow className={styles['light']}>
              {genderEnumToStr(buddy.gender)}
            </IonRow>
          </IonCol>
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
