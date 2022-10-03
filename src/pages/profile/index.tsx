import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { home } from 'ionicons/icons';
import { logout } from '../../api/authentication';
import { useAppDispatch } from '../../redux/hooks';
import { persistor } from '../../redux/store';
import styles from './styles.module.scss';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  async function submitLogout() {
    try {
      await logout();
    } catch (error) {
    } finally {
      persistor.purge();
      dispatch({ type: 'USER_LOGOUT' });
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">User Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton expand="block" onClick={submitLogout}>
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
