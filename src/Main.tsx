import { Redirect, Route, Switch } from 'react-router-dom';
import {
  getPlatforms,
  IonApp,
  IonRouterOutlet,
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
  PAGE_NOT_FOUND,
  PROFILE,
  PROFILE_CREATION,
  PROFILE_FAQ,
  PUBLIC_PROFILE,
  REGISTER,
  SESSIONS,
  USER_HISTORY,
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
import useNotificationForegroundHandler from './util/hooks/useNotificationForegroundHandler';
import Art from './pages/Art';
import AboutArtPage from './pages/Art/AboutArt';
import CoverPhotoSelectionPage from './pages/Art/CoverPhotoSelectionPage';
import Home from './pages/Home';
import TabBarWrapper from './util/TabBarWrapper';
import HomeContents from './pages/Home/HomeContents';
import styles from './styles.module.scss';
import HistoryPage from './pages/History';
import PageNotFound from './pages/PageNotFound';
import FullScreenLoadingSpinner from './components/FullScreenLoadingSpinner';
setupIonicReact();

export default function Main() {
  const { isLoading } = useAuthState();
  const isMobile = getPlatforms().includes('mobile');

  useNotificationForegroundHandler();

  return (
    <IonApp>
      {isLoading ? (
        <FullScreenLoadingSpinner />
      ) : (
        <IonReactRouter>
          {isMobile ? (
            <IonRouterOutlet className={styles['padding']}>
              <UnauthenticatedRoute exact path={LOGIN} component={LoginPage} />
              <UnauthenticatedRoute
                exact
                path={REGISTER}
                component={RegisterPage}
              />
              <Route exact path={HOME} component={HomeContents} />
              <Route exact path={BROWSE} component={Posts} />
              <AuthenticatedRoute exact path={ART} component={Art} />
              <AuthenticatedRoute
                exact
                path={ABOUT_ART}
                component={AboutArtPage}
              />
              <AuthenticatedRoute
                exact
                path={USER_HISTORY}
                component={HistoryPage}
              />
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
              <Route
                exact
                path={PAGE_NOT_FOUND}
                component={PageNotFound}
              ></Route>
              <Route exact path="/" component={Home} />
              <Route render={() => <Redirect to={PAGE_NOT_FOUND} />} />
            </IonRouterOutlet>
          ) : (
            <Switch>
              <Route exact path="/" component={Home} />
              <UnauthenticatedRoute exact path={LOGIN} component={LoginPage} />
              <UnauthenticatedRoute
                exact
                path={REGISTER}
                component={RegisterPage}
              />
              <Route exact path={HOME} component={HomeContents} />
              <Route exact path={BROWSE} component={Posts} />
              <AuthenticatedRoute exact path={ART} component={Art} />
              <AuthenticatedRoute
                exact
                path={ABOUT_ART}
                component={AboutArtPage}
              />
              <AuthenticatedRoute
                exact
                path={USER_HISTORY}
                component={HistoryPage}
              />
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
              <AuthenticatedRoute exact path={PROFILE_FAQ} component={Faq} />
              <AuthenticatedRoute
                exact
                path={NOTIFICATIONS}
                component={NotificationsPage}
              />
              <Route exact path={FAQ} component={Faq} />
              <AuthenticatedRoute
                exact
                path={PUBLIC_PROFILE}
                component={Profile}
              />
              <Route path="*" component={PageNotFound}></Route>
            </Switch>
          )}
          {isMobile && <TabBarWrapper />}
        </IonReactRouter>
      )}
    </IonApp>
  );
}
