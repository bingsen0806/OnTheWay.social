import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonModal,
  IonPopover,
  IonRow,
} from '@ionic/react';
import { facultyEnumToStr, genderEnumToStr, User } from '../../api/types';
import { helpCircleOutline } from 'ionicons/icons';
import styles from './styles.module.scss';
import NoData from '../NoData';
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

  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={closeModal}
      className={styles['modal-container']}
    >
      <ProfileHeader
        thumbnailPhoto={user.thumbnailPhoto}
        profilePhoto={user.profilePhoto}
        isPublicProfile
      ></ProfileHeader>
      <IonContent fullscreen>
        <IonGrid className="ion-margin">
          <IonRow className="ion-justify-content-center ion-align-items-start">
            <IonCol size="12" sizeMd="8" sizeLg="5">
              <IonGrid>
                <IonRow className="ion-padding-start ion-justify-content-center">
                  <IonCol className={styles['user-info']}>
                    <IonRow className={styles['bold']}>{user.name}</IonRow>
                    <IonRow>
                      Y{user.year ?? 0}/
                      {facultyEnumToStr(user.faculty) ?? 'unknown faculty'}
                    </IonRow>
                    <IonRow>
                      {genderEnumToStr(user.gender) ?? 'unknown gender'}
                    </IonRow>
                  </IonCol>
                  <IonCol size="12">
                    {user.art && user.art.length > 0 ? (
                      <>
                        <h3>
                          Art
                          <IonIcon
                            className={styles['padding']}
                            icon={helpCircleOutline}
                            id="art-popover"
                          />
                        </h3>
                        <IonPopover trigger="art-popover" triggerAction="click">
                          <IonContent class="ion-padding">
                            These are AI-generated art pieces owned by{' '}
                            {user.name}. Art pieces are randomly generated as
                            you create, apply and accept study sessions
                          </IonContent>
                        </IonPopover>
                      </>
                    ) : (
                      <NoData hideImage={true}>
                        <div>
                          <h1>Nothing much here...</h1>
                          <p>
                            {user.name} has chosen to keep their profile
                            minimal!
                          </p>
                        </div>
                      </NoData>
                    )}
                  </IonCol>
                </IonRow>
              </IonGrid>
              <IonGrid>
                <IonRow>
                  {user.art?.map((art) => {
                    return (
                      <IonCol size="12" sizeMd="6" sizeLg="4">
                        <IonImg src={art.image} />
                      </IonCol>
                    );
                  })}
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
}
