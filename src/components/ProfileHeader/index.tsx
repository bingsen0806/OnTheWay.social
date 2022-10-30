import { IonAvatar, IonButton, IonIcon } from '@ionic/react';
import { pencil } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { CHANGE_COVER_PHOTO } from '../../routes';
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
  const history = useHistory();
  console.log('profile: ', profilePhoto);
  console.log('thumbnail: ', thumbnailPhoto);
  return (
    <div className={`${styles['profile-toolbar']}`}>
      <div
        className={styles['profile-photo-container']}
        style={{ backgroundImage: `url("${profilePhoto}")` }}
      >
        {!isPublicProfile && (
          <IonButton
            color="light"
            className={styles['edit-cover-button']}
            onClick={() => {
              history.push(CHANGE_COVER_PHOTO);
            }}
          >
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
    </div>
  );
}
