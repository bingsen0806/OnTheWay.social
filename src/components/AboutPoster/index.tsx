import { IonAvatar, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useState } from 'react';
import { facultyEnumToStr, genderEnumToStr, User } from '../../api/types';
import PublicProfileModal from '../../pages/PublicProfileModal';
import styles from './styles.module.scss';

interface AboutPosterProps {
  poster: User;
}

export default function AboutPoster({ poster }: AboutPosterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  return (
    <>
      <PublicProfileModal isOpen={isOpen} onClose={closeModal} user={poster} />
      <IonGrid className="ion-margin-vertical">
        <IonRow
          className={
            styles['header'] + ' ion-justify-content-start ion-padding-start'
          }
        >
          <IonCol>About the poster</IonCol>
        </IonRow>
        <IonRow
          className="ion-padding-start ion-justify-content-center"
          onClick={openModal}
        >
          <IonCol size="3">
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
