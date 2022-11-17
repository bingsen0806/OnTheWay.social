import { useHistory, useLocation } from 'react-router-dom';
import { IonButton, IonHeader, IonIcon, IonToolbar } from '@ionic/react';
import styles from './styles.module.scss';
import {
  BROWSE,
  CREATE_POST,
  HOME,
  NOTIFICATIONS,
  PROFILE,
  SESSIONS,
} from '../../routes';
import { useAuthState } from '../../util/authentication';
import logo from '../../assets/icon/logo.png';
import { person } from 'ionicons/icons';
import { useAppSelector } from '../../redux/hooks';
import { getNumberOfUnviewedNotifications } from '../../constants';

function DesktopNavbar() {
  const location = useLocation();
  const pathName = location.pathname;
  const { isAuthenticated } = useAuthState();
  const haveNotifications = useAppSelector(
    (state) =>
      getNumberOfUnviewedNotifications(state.notifications.notifications) > 0
  );
  const history = useHistory();
  const routeToHome = () => {
    if (pathName.includes(HOME)) {
      return;
    }
    history.replace(HOME);
  };

  return (
    <IonHeader mode="ios" className={styles['desktop']}>
      <IonToolbar>
        <div
          slot="start"
          className={styles['logo-container']}
          onClick={routeToHome}
        >
          <img src={logo} className={styles.logo} alt="logo" />
        </div>
        <div slot="end">
          <div className={`ion-text-center`}>
            <IonButton
              fill="clear"
              color={pathName.includes(BROWSE) ? 'primary' : 'dark'}
              routerLink={BROWSE}
              routerDirection="root"
              className="link"
            >
              Browse
            </IonButton>
            {isAuthenticated && (
              <IonButton
                fill="clear"
                color={pathName.includes(SESSIONS) ? 'primary' : 'dark'}
                routerLink={SESSIONS}
                routerDirection="root"
                className="link"
              >
                My Sessions
              </IonButton>
            )}
            {isAuthenticated && (
              <IonButton
                color="primary"
                routerLink={CREATE_POST}
                routerDirection="root"
                className="link"
                size="small"
              >
                Create Session
              </IonButton>
            )}
            {isAuthenticated && (
              <IonButton
                fill="clear"
                color={pathName.includes(NOTIFICATIONS) ? 'primary' : 'dark'}
                routerLink={NOTIFICATIONS}
                routerDirection="root"
                className="link"
              >
                {haveNotifications ? (
                  <IonIcon src="assets/icons/notification-tab-unviewed.svg" />
                ) : (
                  <IonIcon
                    src="assets/icons/notification-tab-viewed.svg"
                    size="small"
                  ></IonIcon>
                )}
              </IonButton>
            )}
            <IonButton
              fill="clear"
              color={pathName.includes(PROFILE) ? 'primary' : 'dark'}
              routerLink={PROFILE}
              routerDirection="root"
              className="link ion-no-margin"
            >
              <IonIcon icon={person} size="small"></IonIcon>
            </IonButton>
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}

export default DesktopNavbar;
