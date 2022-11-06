import {
  getPlatforms,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonPopover,
  IonRow,
  useIonViewDidEnter,
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
import { useLocation } from 'react-router';
import FullScreenLoadingSpinner from '../../components/FullScreenLoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserObject } from '../../redux/slices/userSlice';

interface PublicProfileContentsProps {
  userId?: string;
  user?: User;
  onClose?: () => void;
}

interface StateObject {
  user: User;
}

export default function PublicProfileContents({
  userId,
  user,
  onClose,
}: PublicProfileContentsProps) {
  let userObject: User | undefined = user;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const state: StateObject = location.state as StateObject;
  const otherUser = useAppSelector((state) => state.user.otherUser);
  if (state) {
    const stateObject: User = state.user ;
    userObject = stateObject;
  }

  useIonViewDidEnter(() => {
    if (userId) {
      void dispatch(getUserObject(userId));
    }
  });
  if (!userObject) {
    userObject = otherUser;
  }

  const isMobile = getPlatforms().includes('mobile');

  if (!userObject && !userId) {
    return (
      <>
        <p>Oops! An unexpected error occured.</p>
      </>
    );
  }

  return (
    <>
      {userObject.id !== '' ? (
        <>
          {isMobile && (
            <IonButton
              color="dark"
              fill="clear"
              className={styles['back-button']}
              onClick={onClose}
            >
              <IonIcon icon={arrowBackOutline}></IonIcon>
            </IonButton>
          )}
          <IonGrid className={styles['mobile']}>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeMd="8">
                <ProfileHeader
                  thumbnailPhoto={userObject.thumbnailPhoto}
                  profilePhoto={userObject.profilePhoto}
                  isPublicProfile
                ></ProfileHeader>
                <IonGrid>
                  <IonRow className="ion-justify-content-center">
                    <IonCol>
                      <IonRow>
                        <IonCol className="ion-padding-start">
                          <h1>{userObject.name}</h1>
                          {userObject.gender !== Gender.PREFER_NOT_TO_SAY &&
                            genderEnumToStr(userObject.gender)}
                          <p>
                            Y{userObject.year},{' '}
                            {facultyEnumToStr(userObject.faculty)}
                          </p>
                        </IonCol>
                      </IonRow>
                      <IonRow className="ion-align-items-center ion-justify-content-start">
                        <IonCol className="ion-padding-start" size="12">
                          <h3 className={styles['art-header']}>
                            Art{' '}
                            <IonIcon
                              className={styles['art-popover-button']}
                              icon={helpCircleOutline}
                              id="art-popover"
                              size="small"
                            />
                          </h3>
                          <IonPopover
                            trigger="art-popover"
                            triggerAction="click"
                          >
                            <IonContent class="ion-padding">
                              These are AI-generated art pieces owned by{' '}
                              {userObject.name}. Art pieces are randomly
                              generated as you create, apply and accept study
                              sessions
                            </IonContent>
                          </IonPopover>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        {userObject.art &&
                          userObject.art.map((artPiece) => (
                            <IonCol size="6" sizeLg="3" key={artPiece.id}>
                              <IonImg src={artPiece.image}></IonImg>
                            </IonCol>
                          ))}
                      </IonRow>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          </IonGrid>
        </>
      ) : (
        <FullScreenLoadingSpinner />
      )}
    </>
  );
}
