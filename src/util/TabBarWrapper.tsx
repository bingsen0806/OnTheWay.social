import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import React from 'react';
import { Route, useLocation } from 'react-router';
import { useAuthState } from './authentication';
import {
  ABOUT_ART,
  ART,
  BROWSE,
  CAMPAIGN,
  CHANGE_COVER_PHOTO,
  CREATE_POST,
  EMAIL_VERIFICATION,
  FAQ,
  HOME,
  LOGIN,
  NOTIFICATIONS,
  PROFILE,
  PROFILE_CREATION,
  PROFILE_FAQ,
  REGISTER,
  SESSIONS,
} from '../routes';
import {
  addCircleSharp,
  book,
  helpCircleOutline,
  home,
  person,
} from 'ionicons/icons';
import styles from '../styles.module.scss';
import { useAppSelector } from '../redux/hooks';
import { getNumberOfUnviewedNotifications } from '../constants';
import UnauthenticatedRoute from './authentication/UnauthenticatedRoute';
import AuthenticatedRoute from './authentication/AuthenticatedRoute';
import LoginPage from '../pages/authentication/LoginPage';
import AboutArtPage from '../pages/Art/AboutArt';
import Home from '../pages/Home';
import Art from '../pages/Art';
import RegisterPage from '../pages/authentication/RegisterPage';
import CoverPhotoSelectionPage from '../pages/Art/CoverPhotoSelectionPage';
import Posts from '../pages/posts';
import Campaigns from '../pages/campaigns';
import EmailVerificationPage from '../pages/authentication/EmailVerificationPage';
import ProfileCreationPage from '../pages/authentication/ProfileCreationPage';
import CreatePostPage from '../pages/posts/CreatePostPage';
import Sessions from '../pages/sessions';
import Profile from '../pages/profile';
import NotificationsPage from '../pages/Notifications';
import Faq from '../pages/faq';

function TabBarWrapper() {
  const currentPath = useLocation().pathname;
  const isOnHome = currentPath.includes(HOME) || currentPath === '/';
  const isOnBrowse = currentPath.includes(BROWSE);
  const { isAuthenticated } = useAuthState();
  const haveNotifications = useAppSelector(
    (state) =>
      getNumberOfUnviewedNotifications(state.notifications.notifications) > 0
  );
  return (
    <IonTabs>
      <IonRouterOutlet>
        <UnauthenticatedRoute exact path={LOGIN} component={LoginPage} />
        <UnauthenticatedRoute exact path={REGISTER} component={RegisterPage} />
        <Route exact path={HOME} component={Home} />
        <Route exact path={BROWSE} component={Posts} />
        <AuthenticatedRoute exact path={ART} component={Art} />
        <AuthenticatedRoute exact path={ABOUT_ART} component={AboutArtPage} />
        <AuthenticatedRoute
          exact
          path={CHANGE_COVER_PHOTO}
          component={CoverPhotoSelectionPage}
        />
        <AuthenticatedRoute exact path={CAMPAIGN} component={Campaigns} />
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
        <AuthenticatedRoute exact path={PROFILE_FAQ} component={Faq} />
        <UnauthenticatedRoute exact path={FAQ} component={Faq} />
        <Route exact path="/" component={Home} />
      </IonRouterOutlet>
      {isOnHome && <IonTabBar slot="bottom" />}
      {!isOnHome && (
        <IonTabBar slot="bottom">
          <IonTabButton
            tab="home"
            href={BROWSE}
            className={isOnBrowse ? styles['browse'] : ''}
          >
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

          {isAuthenticated && (
            <IonTabButton tab="createPost" href={CREATE_POST}>
              <IonIcon icon={addCircleSharp} />
              <IonLabel className={styles['tab-button-text']}>Create</IonLabel>
            </IonTabButton>
          )}
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
          {!isAuthenticated && (
            <IonTabButton tab="faq" href={FAQ}>
              <IonIcon icon={helpCircleOutline} />
              <IonLabel className={styles['tab-button-text']}>FAQ</IonLabel>
            </IonTabButton>
          )}
        </IonTabBar>
      )}
    </IonTabs>
  );
}

export default TabBarWrapper;
