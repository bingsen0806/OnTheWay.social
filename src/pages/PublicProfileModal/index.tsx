import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonModal,
  IonPopover,
  IonRow,
} from '@ionic/react';
import {
  facultyEnumToStr,
  Gender,
  genderEnumToStr,
  User,
} from '../../api/types';
import { arrowBackOutline, helpCircleOutline } from 'ionicons/icons';
import styles from './styles.module.scss';
import ProfileHeader from '../../components/ProfileHeader';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function PublicProfileModal({
  isOpen,
  onClose,
  user,
}: PublicProfileModalProps) {
  function closeModal() {
    onClose();
  }

  const art = user.art ? user.art : [];

  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={closeModal}
      className={styles['modal-container']}
    >
      <IonContent fullscreen>
        <IonButton
          color="light"
          fill="solid"
          className={styles['back-button']}
          size="small"
          onClick={onClose}
        >
          <IonIcon icon={arrowBackOutline}></IonIcon>
        </IonButton>
        <ProfileHeader
          thumbnailPhoto={user.thumbnailPhoto}
          profilePhoto={user.profilePhoto}
          isPublicProfile
        ></ProfileHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeLg="6">
              <IonRow>
                <IonCol className="ion-padding-start">
                  <h1>{user.name}</h1>
                  {user.gender !== Gender.PREFER_NOT_TO_SAY &&
                    genderEnumToStr(user.gender)}
                  <p>
                    Y{user.year}, {facultyEnumToStr(user.faculty)}
                  </p>
                </IonCol>
              </IonRow>
              <IonRow className="ion-align-items-center ion-justify-content-start">
                <IonCol className="ion-padding-start" size="2" sizeMd="1">
                  <h3 className={styles['art-header']}>Art</h3>
                </IonCol>
                <IonCol>
                  <IonIcon
                    className={styles['art-popover-button']}
                    icon={helpCircleOutline}
                    id="art-popover"
                    size="small"
                  />
                  <IonPopover trigger="art-popover" triggerAction="click">
                    <IonContent class="ion-padding">
                      These are AI-generated art pieces owned by {user.name}.
                      Art pieces are randomly generated as you create, apply and
                      accept study sessions
                    </IonContent>
                  </IonPopover>
                </IonCol>
              </IonRow>
              <IonRow>
                {art.map((artPiece) => (
                  <IonCol size="6" key={artPiece.id}>
                    <IonImg src={artPiece.image}></IonImg>
                  </IonCol>
                ))}
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}
