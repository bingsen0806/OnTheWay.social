import { Route } from 'react-router-dom';
import {
  getPlatforms,
  IonApp,
  IonRouterOutlet,
  isPlatform,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import Campaigns from './pages/campaigns';
import NotificationsPage from './pages/Notifications';
import { useAppDispatch } from './redux/hooks';
import useNotificationForegroundHandler from './util/hooks/useNotificationForegroundHandler';
import { useLayoutEffect } from 'react';
import { loadNotifications } from './redux/slices/notificationsSlice';
import { generateAndSendNotificationRegistrationToken } from './firebase';
import Art from './pages/Art';
import AboutArtPage from './pages/Art/AboutArt';
import CoverPhotoSelectionPage from './pages/Art/CoverPhotoSelectionPage';
import DesktopNavbar from './components/Navbar/DesktopNavbar';
import Home from './pages/Home';
import TabBarWrapper from './util/TabBarWrapper';
setupIonicReact();

export default function Main() {
  const { isAuthenticated } = useAuthState();
  const dispatch = useAppDispatch();
  const isMobile = getPlatforms().includes('mobile');
  /**
   * Set up a check on notifications at regular intervals of 10s.
   */
  useLayoutEffect(() => {
    if (!isPlatform('ios') && Notification.permission === 'granted') {
      generateAndSendNotificationRegistrationToken();
    }

    if (isAuthenticated) {
      void dispatch(loadNotifications(true));
      const notificationChecker = setInterval(() => {
        void dispatch(loadNotifications(true));
      }, 10000);
      return () => {
        clearInterval(notificationChecker);
      };
    }
  }, [isAuthenticated]);

  useNotificationForegroundHandler();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <UnauthenticatedRoute exact path={LOGIN} component={LoginPage} />
          <UnauthenticatedRoute
            exact
            path={REGISTER}
            component={RegisterPage}
          />
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
        {isMobile && <TabBarWrapper />}
        {!isMobile && <DesktopNavbar />}
      </IonReactRouter>
    </IonApp>
  );
}
