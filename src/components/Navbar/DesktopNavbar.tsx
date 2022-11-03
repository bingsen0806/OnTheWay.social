import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonRouterOutlet,
  IonText,
  IonToolbar,
} from '@ionic/react';
import Posts from '../../pages/posts';
import Profile from '../../pages/profile';
import Faq from '../../pages/faq';
import styles from './styles.module.scss';
import {
  ABOUT_ART,
  ART,
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
  REGISTER,
  SESSIONS,
} from '../../routes';
import UnauthenticatedRoute from '../../util/authentication/UnauthenticatedRoute';
import LoginPage from '../../pages/authentication/LoginPage';
import RegisterPage from '../../pages/authentication/RegisterPage';
import AuthenticatedRoute from '../../util/authentication/AuthenticatedRoute';
import Art from '../../pages/Art';
import AboutArtPage from '../../pages/Art/AboutArt';
import CoverPhotoSelectionPage from '../../pages/Art/CoverPhotoSelectionPage';
import Campaigns from '../../pages/campaigns';
import EmailVerificationPage from '../../pages/authentication/EmailVerificationPage';
import ProfileCreationPage from '../../pages/authentication/ProfileCreationPage';
import CreatePostPage from '../../pages/posts/CreatePostPage';
import Sessions from '../../pages/sessions';
import NotificationsPage from '../../pages/Notifications';
import { useAuthState } from '../../util/authentication';
import logo from '../../assets/icon/favicon.png';

function DesktopNavbar() {
  const location = useLocation();
  const pathName = location.pathname;
  const { isAuthenticated } = useAuthState();
  const history = useHistory();
  const routeToHome = () => {
    if (pathName.includes(HOME)) {
      return;
    }
    history.replace(HOME);
  };
  return (
    <div className={styles.desktop}>
      <IonHeader mode="ios">
        <IonToolbar>
          <div
            slot="start"
            className={styles['logo-container']}
            onClick={routeToHome}
          >
            <img src={logo} className={styles.logo} />
            <IonText color="primary">
              <span className="ion-padding-horizontal">BuddyNUS</span>
            </IonText>
          </div>
          <div slot="end">
            <div className={`ion-text-center`}>
              <IonButton
                fill="clear"
                color={pathName.includes(HOME) ? 'primary' : 'dark'}
                routerLink={HOME}
                routerDirection="root"
                className="link"
              >
                Home
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
                  fill="clear"
                  routerLink={CREATE_POST}
                  color={pathName.includes(CREATE_POST) ? 'primary' : 'dark'}
                  routerDirection="root"
                  className="link"
                >
                  Create
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
                  Notifications
                </IonButton>
              )}
              <IonButton
                fill="clear"
                color={pathName.includes(PROFILE) ? 'primary' : 'dark'}
                routerLink={PROFILE}
                routerDirection="root"
                className="link"
              >
                Profile
              </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRouterOutlet className={styles['desktop-wrapper']}>
          <UnauthenticatedRoute exact path={LOGIN} component={LoginPage} />
          <UnauthenticatedRoute
            exact
            path={REGISTER}
            component={RegisterPage}
          />
          <Route exact path={HOME} component={Posts} />
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
          <Route exact path={FAQ} component={Faq} />
          <Route exact path="/">
            <Redirect to={HOME} />
          </Route>
        </IonRouterOutlet>
      </IonContent>

      {/* <div className="footer">FOOTER</div> */}
    </div>
  );
}

export default DesktopNavbar;
