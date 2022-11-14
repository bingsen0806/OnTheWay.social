import {
  getPlatforms,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  isPlatform,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import FullScreenLoadingSpinner from '../../components/FullScreenLoadingSpinner';
import DesktopNavbar from '../../components/Navbar/DesktopNavbar';
import Footer from '../../components/Navbar/Footer';
import { generateAndSendNotificationRegistrationToken } from '../../firebase';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadNotifications } from '../../redux/slices/notificationsSlice';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useErrorToast from '../../util/hooks/useErrorToast';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import NoData from '../NoData';
import NotificationListItem from './components/NotificationListItem';
import styles from './styles.module.scss';

export default function NotificationsPage() {
  const notificationsList = useAppSelector(
    (state) => state.notifications.notifications
  );
  const isLoading = useAppSelector((state) => state.notifications.isLoading);
  const dispatch = useAppDispatch();
  const [hasGivenNotificationPermission, setHasGivenNotificationPermission] =
    useState<boolean>(
      !isPlatform('ios') && Notification.permission === 'granted'
    );
  const [isNotificationPermissionDenied, setIsNotificationPermissionDenied] =
    useState<boolean>(
      !isPlatform('ios') && Notification.permission === 'denied'
    );
  const [
    isNotificationPermissionModalOpen,
    setIsNotificationPermissionModalOpen,
  ] = useState<boolean>(false);
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const presentErrorToast = useErrorToast();
  const location = useLocation();
  const history = useHistory();
  const isMobile = getPlatforms().includes('mobile');

  useLayoutEffect(() => {
    if (!isPlatform('ios')) {
      setHasGivenNotificationPermission(Notification.permission === 'granted');
      setIsNotificationPermissionDenied(Notification.permission === 'denied');
    }
  }, []);

  useEffect(() => {
    if (
      !location.search.includes('modal=true') &&
      isNotificationPermissionModalOpen
    ) {
      setIsNotificationPermissionModalOpen(false);
    }
  }, [location]);

  const refreshPage = () => {
    dispatch(loadNotifications(false))
      .unwrap()
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message as string);
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      });
  };

  function requestNotificationPermissionsPopup() {
    if (Notification.permission === 'denied') {
      presentErrorToast(
        'Notifications from BuddyNUS on your browser are currently blocked!'
      );
    } else if (Notification.permission === 'default') {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === 'granted') {
            generateAndSendNotificationRegistrationToken();
            setIsNotificationPermissionModalOpen(false);
          } else if (permission === 'denied') {
            setIsNotificationPermissionDenied(true);
            console.log('Permission to receive notifications denied.');
          } else {
            console.log('Permission to receive notifications not given.');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function openNotificationPermissionsModal() {
    history.push({ search: '?modal=true' });
    setIsNotificationPermissionModalOpen(true);
  }

  return (
    <IonPage>
      {!isMobile && <DesktopNavbar />}
      <IonHeader>
        <IonToolbar>
          <h1 className="ion-padding-start">Notifications</h1>
        </IonToolbar>
        <IonToolbar>
          <div className="ion-padding-start">
            <p>Notifications are sent to your email.</p>
            {!isPlatform('ios') ? (
              hasGivenNotificationPermission ? (
                <p>
                  You will also receive notifications directly to your mobile or
                  desktop when your browser/BuddyNUS app is open in the
                  background!
                </p>
              ) : (
                <p>
                  Want to receive notifications directly to your phone or
                  computer?{' '}
                  <a
                    className={
                      styles['open-notification-permission-modal-link']
                    }
                    onClick={openNotificationPermissionsModal}
                  >
                    Click Here
                  </a>
                </p>
              )
            ) : null}
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isLoading ? (
          <FullScreenLoadingSpinner />
        ) : (
          <>
            <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <IonList>
              {notificationsList.length > 0 ? (
                notificationsList.map((notification) => (
                  <NotificationListItem
                    notification={notification}
                    key={notification.id}
                  />
                ))
              ) : (
                <NoData>
                  <p className="ion-text-center">
                    You have no notifications. Check again later!
                  </p>
                </NoData>
              )}
            </IonList>
          </>
        )}
        <IonModal
          onWillDismiss={() => {
            if (location.search.includes('modal=true')) {
              history.goBack();
            }
          }}
          isOpen={isNotificationPermissionModalOpen}
        >
          <IonHeader>
            <IonToolbar>
              {isMobile && (
                <IonButtons slot="start">
                  <IonButton
                    fill="clear"
                    color="dark"
                    onClick={(
                      event: React.MouseEvent<HTMLIonButtonElement>
                    ) => {
                      event.stopPropagation();
                      setIsNotificationPermissionModalOpen(false);
                    }}
                  >
                    <IonIcon icon={arrowBackOutline} slot="start" />
                    <p>Back</p>
                  </IonButton>
                </IonButtons>
              )}
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="ion-padding-bottom">
              <p>
                You can opt to receive notifications directly to your android or
                desktop, by providing permission for notifications from
                BuddyNUS. After providing permissions, whenever your browser or
                the BuddyNUS app is open in the background, you will receive
                notifications directly on your android phone or desktop.
              </p>
              <p>
                Currently, only android phones and chrome or edge browsers on
                desktop support this feature! IOS is not supported yet, stay
                tuned for updates!
              </p>
              {isNotificationPermissionDenied && (
                <p>
                  You have blocked notifications from BuddyNUS! Please google
                  "How to unblock notification from website in{' '}
                  {'<your browser>"'} to learn how to unblock it, then refresh
                  this page!
                </p>
              )}
            </div>
            <IonButton
              onClick={requestNotificationPermissionsPopup}
              expand="block"
              color={isNotificationPermissionDenied ? 'medium' : 'primary'}
            >
              Provide Permissions
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
      {!isMobile && <Footer />}
    </IonPage>
  );
}
