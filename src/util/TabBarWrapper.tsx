import { IonIcon } from '@ionic/react';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { useAuthState } from './authentication';
import {
  BROWSE,
  CREATE_POST,
  EMAIL_VERIFICATION,
  FAQ,
  HOME,
  LOGIN,
  NOTIFICATIONS,
  PROFILE,
  PROFILE_CREATION,
  REGISTER,
  SESSIONS,
} from '../routes';
import { addCircleSharp, book, helpCircle, home, person } from 'ionicons/icons';
import styles from './styles.module.scss';
import { useAppSelector } from '../redux/hooks';
import { getNumberOfUnviewedNotifications } from '../constants';

function TabBarWrapper() {
  const history = useHistory();
  const currentPath = useLocation().pathname;
  const { isAuthenticated } = useAuthState();
  const isOnHome =
    currentPath.includes(HOME) || (currentPath === '/' && !isAuthenticated);
  const isOnBrowse =
    currentPath.includes(BROWSE) || (currentPath === '/' && isAuthenticated);
  const haveNotifications = useAppSelector(
    (state) =>
      getNumberOfUnviewedNotifications(state.notifications.notifications) > 0
  );
  const onLoginOrRegister =
    currentPath.includes(LOGIN) ||
    currentPath.includes(REGISTER) ||
    currentPath.includes(EMAIL_VERIFICATION) ||
    currentPath.includes(PROFILE_CREATION);
  const routeToPage = (page: string) => history.replace(page);
  return (
    <>
      {
        isOnHome ? (
          <></>
        ) : (
          <div className={styles.footer}>
            <div
              onClick={() => routeToPage(BROWSE)}
              className={isOnBrowse ? styles['tab-selected'] : styles['tab']}
            >
              <IonIcon icon={home}></IonIcon>
            </div>
            {isAuthenticated ? (
              <>
                <div
                  onClick={() => routeToPage(SESSIONS)}
                  className={
                    currentPath.includes(SESSIONS)
                      ? styles['tab-selected']
                      : styles.tab
                  }
                >
                  <IonIcon icon={book} />
                </div>
                <div
                  onClick={() => routeToPage(CREATE_POST)}
                  className={
                    currentPath.includes(CREATE_POST)
                      ? styles['tab-selected']
                      : styles.tab
                  }
                >
                  <IonIcon icon={addCircleSharp} />
                </div>
                <div
                  onClick={() => routeToPage(NOTIFICATIONS)}
                  className={
                    currentPath.includes(NOTIFICATIONS)
                      ? styles['tab-selected']
                      : styles.tab
                  }
                >
                  {haveNotifications ? (
                    <IonIcon src="assets/icons/notification-tab-unviewed.svg" />
                  ) : (
                    <IonIcon src="assets/icons/notification-tab-viewed.svg"></IonIcon>
                  )}
                </div>
                <div
                  onClick={() => routeToPage(PROFILE)}
                  className={
                    currentPath.includes(PROFILE)
                      ? styles['tab-selected']
                      : styles.tab
                  }
                >
                  <IonIcon icon={person} />
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={() => routeToPage(LOGIN)}
                  className={
                    onLoginOrRegister ? styles['tab-selected'] : styles.tab
                  }
                >
                  <IonIcon icon={person}></IonIcon>
                </div>
                <div
                  onClick={() => routeToPage(FAQ)}
                  className={
                    currentPath.includes(FAQ)
                      ? styles['tab-selected']
                      : styles.tab
                  }
                >
                  <IonIcon icon={helpCircle}></IonIcon>
                </div>
              </>
            )}
          </div>
        )
        // <IonTabBar slot="bottom">
        //   <IonTabButton
        //     tab="home"
        //     href={BROWSE}
        //     className={isOnBrowse ? styles['browse'] : ''}
        //   >
        //     <IonIcon icon={home} />
        //     <IonLabel className={styles['tab-button-text']}>Home</IonLabel>
        //   </IonTabButton>
        //   {isAuthenticated && (
        //     <IonTabButton tab="sessions" href={SESSIONS}>
        //       <IonIcon icon={book} />
        //       <IonLabel className={styles['tab-button-text']}>
        //         Sessions
        //       </IonLabel>
        //     </IonTabButton>
        //   )}

        //   {isAuthenticated && (
        //     <IonTabButton tab="createPost" href={CREATE_POST}>
        //       <IonIcon icon={addCircleSharp} />
        //       <IonLabel className={styles['tab-button-text']}>Create</IonLabel>
        //     </IonTabButton>
        //   )}
        //   {isAuthenticated && (
        //     <IonTabButton tab="notifications" href={NOTIFICATIONS}>
        //       {haveNotifications ? (
        //         <IonIcon
        //           src="assets/icons/notification-tab-unviewed.svg"
        //           size="large"
        //         />
        //       ) : (
        //         <IonIcon src="assets/icons/notification-tab-viewed.svg"></IonIcon>
        //       )}
        //       <IonLabel className={styles['tab-button-text']}>
        //         Notifications
        //       </IonLabel>
        //     </IonTabButton>
        //   )}
        //   <IonTabButton tab="profile" href={PROFILE}>
        //     <IonIcon icon={person} />
        //     <IonLabel className={styles['tab-button-text']}>Profile</IonLabel>
        //   </IonTabButton>
        //   {!isAuthenticated && (
        //     <IonTabButton tab="faq" href={FAQ}>
        //       <IonIcon icon={helpCircleOutline} />
        //       <IonLabel className={styles['tab-button-text']}>FAQ</IonLabel>
        //     </IonTabButton>
        //   )}
        // </IonTabBar>
      }
    </>
  );
}

export default TabBarWrapper;
