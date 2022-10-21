import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircleSharp, book, home, person } from 'ionicons/icons';
import Posts from './pages/posts';
import Profile from './pages/profile';
import Faq from './pages/faq';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.scss';
import styles from './styles.module.scss';

import {
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
} from './routes';
import { useAuthState } from './util/authentication';
import AuthenticatedRoute from './util/authentication/AuthenticatedRoute';
import UnauthenticatedRoute from './util/authentication/UnauthenticatedRoute';
import LoginPage from './pages/authentication/LoginPage';
import RegisterPage from './pages/authentication/RegisterPage';
import EmailVerificationPage from './pages/authentication/EmailVerificationPage';
import ProfileCreationPage from './pages/authentication/ProfileCreationPage';
import CreatePostPage from './pages/posts/CreatePostPage';
import Sessions from './pages/sessions';
import NotificationsPage from './pages/Notifications';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getNumberOfUnviewedNotifications } from './constants';
import useNotificationForegroundHandler from './util/hooks/useNotificationForegroundHandler';
import { useLayoutEffect } from 'react';
import { loadNotifications } from './redux/slices/notificationsSlice';
setupIonicReact();

export default function Main() {
  const { isAuthenticated } = useAuthState();
  const dispatch = useAppDispatch();

  /**
   * Set up a check on notifications at regular intervals of 10s.
   */
  useLayoutEffect(() => {
    void dispatch(loadNotifications(true));
    const notificationChecker = setInterval(() => {
      void dispatch(loadNotifications(true));
    }, 10000);
    return () => {
      clearInterval(notificationChecker);
    };
  }, [isAuthenticated]);

  useNotificationForegroundHandler();
  const haveNotifications = useAppSelector(
    (state) =>
      getNumberOfUnviewedNotifications(state.notifications.notifications) > 0
  );

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <UnauthenticatedRoute exact path={LOGIN} component={LoginPage} />
            <UnauthenticatedRoute
              exact
              path={REGISTER}
              component={RegisterPage}
            />
            <Route exact path={FAQ} component={Faq} />
            <Route exact path="/">
              <Redirect to={HOME} />
            </Route>
            <Route exact path={HOME} component={Posts} />
            <AuthenticatedRoute
              exact
              path={EMAIL_VERIFICATION}
              component={EmailVerificationPage}
            />
            <AuthenticatedRoute
              exact
              path={PROFILE_CREATION}
              component={ProfileCreationPage}
            />
            <AuthenticatedRoute
              exact
              path={CREATE_POST}
              component={CreatePostPage}
            />
            <AuthenticatedRoute exact path={PROFILE} component={Profile} />
            <AuthenticatedRoute exact path={SESSIONS} component={Sessions} />
            <AuthenticatedRoute
              exact
              path={NOTIFICATIONS}
              component={NotificationsPage}
            />
            <Route exact path={FAQ} component={Faq} />
            <Route exact path="/">
              <Redirect to={HOME} />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href={HOME}>
              <IonIcon icon={home} />
              <IonLabel className={styles['tab-button-text']}>Home</IonLabel>
            </IonTabButton>
            {isAuthenticated && (
              <IonTabButton tab="sessions" href={SESSIONS}>
                <IonIcon icon={book} />
                <IonLabel className={styles['tab-button-text']}>
                  Sessions
                </IonLabel>
              </IonTabButton>
            )}

            <IonTabButton tab="createPost" href={CREATE_POST}>
              <IonIcon icon={addCircleSharp} />
              <IonLabel className={styles['tab-button-text']}>Create</IonLabel>
            </IonTabButton>
            {isAuthenticated && (
              <IonTabButton tab="notifications" href={NOTIFICATIONS}>
                {haveNotifications ? (
                  <IonIcon
                    src="assets/icons/notification-tab-unviewed.svg"
                    size="large"
                  />
                ) : (
                  <IonIcon src="assets/icons/notification-tab-viewed.svg"></IonIcon>
                )}
                <IonLabel className={styles['tab-button-text']}>
                  Notifications
                </IonLabel>
              </IonTabButton>
            )}
            <IonTabButton tab="profile" href={PROFILE}>
              <IonIcon icon={person} />
              <IonLabel className={styles['tab-button-text']}>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
