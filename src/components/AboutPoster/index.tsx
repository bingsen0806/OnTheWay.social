import { getPlatforms, IonAvatar, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { facultyEnumToStr, genderEnumToStr, Post, User } from '../../api/types';
import PublicProfileModal from '../../pages/PublicProfileModal';
import styles from './styles.module.scss';

interface AboutPosterProps {
  poster: User;
  post: Post;
}

export default function AboutPoster({ poster, post }: AboutPosterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const history = useHistory();
  const openModal = () => {
    if (isMobile) {
      setIsOpen(true);
    } else {
      history.push({
        pathname: '/profile',
        search: `?userId=${poster.id}`,
        state: { user: poster },
      });
    }
  };
  const isMobile = getPlatforms().includes('mobile');
  return (
    <>
      {isMobile && (
        <PublicProfileModal
          isOpen={isOpen}
          onClose={closeModal}
          user={poster}
        />
      )}
      <IonGrid className="ion-no-padding ion-no-margin">
        <IonRow className={styles['header'] + ' ion-justify-content-start'}>
          <IonCol>About the poster</IonCol>
        </IonRow>
        <IonRow
          className="ion-justify-content-start ion-padding-top"
          onClick={openModal}
        >
          <IonCol size="3" sizeMd="4" sizeLg="5">
            <IonAvatar className={styles['avatar']}>
              <img alt="profilePic" src={poster.thumbnailPhoto} />{' '}
            </IonAvatar>
          </IonCol>
          <IonCol className={styles['user-info']}>
            <IonRow className={styles['poster-name']}>{poster.name}</IonRow>
            <IonRow>
              Y{poster.year ?? 0}/
              {facultyEnumToStr(poster.faculty) ?? 'unknown faculty'}
            </IonRow>
            <IonRow>
              {genderEnumToStr(poster.gender) ?? 'unknown gender'}
            </IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
}
