import {
  IonHeader,
  IonToolbar,
  IonAvatar,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { pencil } from 'ionicons/icons';
import styles from './styles.module.scss';

interface ProfileHeaderProps {
  profilePhoto: string;
  thumbnailPhoto: string;
  isPublicProfile?: boolean;
  editThumbnailHandler?: () => void;
  editProfilePhoto?: () => void;
}
export default function ProfileHeader({
  profilePhoto,
  thumbnailPhoto,
  isPublicProfile = false,
  editThumbnailHandler,
}: ProfileHeaderProps) {
  return (
    <IonHeader className="ion-no-border">
      <IonToolbar className={styles['profile-toolbar']}>
        <div
          className={styles['profile-photo-container']}
          style={{ backgroundImage: `url("${profilePhoto})"` }}
        >
          {!isPublicProfile && (
            <IonButton color="light" className={styles['edit-cover-button']}>
              <IonIcon icon={pencil}></IonIcon>
            </IonButton>
          )}
        </div>
        <IonAvatar
          onClick={
            !isPublicProfile
              ? editThumbnailHandler
              : () => {
                  return;
                }
          }
          className={`ion-margin-start ${styles['thumbnail-photo-container']} ${
            !isPublicProfile ? styles['thumbnail-photo-container-public'] : ''
          }`}
        >
          <img
            alt="thumbnail"
            className={styles['thumbnail-photo']}
            src={thumbnailPhoto}
          />
        </IonAvatar>
      </IonToolbar>
    </IonHeader>
  );
}
