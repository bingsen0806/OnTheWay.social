import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadNotifications } from '../../redux/slices/notificationsSlice';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import NotificationListItem from './components/NotificationListItem';

export default function NotificationsPage() {
  const notificationsList = useAppSelector(
    (state) => state.notifications.notifications
  );
  const isLoading = useAppSelector((state) => state.notifications.isLoading);
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();

  const refreshPage = () => {
    dispatch(loadNotifications())
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <h1 className="ion-padding-start">Notifications</h1>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <IonList>
              {notificationsList.map((notification) => (
                <NotificationListItem
                  notification={notification}
                  key={notification.id}
                />
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
