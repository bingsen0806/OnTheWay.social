import { Route, useHistory, useLocation } from 'react-router-dom';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonRow,
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
  BROWSE,
  CAMPAIGN,
  CHANGE_COVER_PHOTO,
  CREATE_POST,
  EMAIL_VERIFICATION,
  FAQ,
  HOME,
  INSTAGRAM,
  LOGIN,
  NOTIFICATIONS,
  PROFILE,
  PROFILE_CREATION,
  PROFILE_FAQ,
  PUBLIC_PROFILE,
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
import { person } from 'ionicons/icons';
import { useAppSelector } from '../../redux/hooks';
import { getNumberOfUnviewedNotifications } from '../../constants';
import { useState } from 'react';
import Home from '../../pages/Home';
import HomeContents from '../../pages/Home/HomeContents';
import LoadingSpinner from '../FullScreenLoadingSpinner';
import Footer from './Footer';

function DesktopNavbar() {
  const location = useLocation();
  const pathName = location.pathname;
  const { isAuthenticated, isLoading } = useAuthState();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
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
  const routeToFaq = () => {
    history.replace(FAQ);
  };
  const openInstagram = () => {
    window.open(INSTAGRAM, '_blank');
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className={styles.desktop}>
          <IonHeader mode="ios">
            <IonToolbar>
              <div
                slot="start"
                className={styles['logo-container']}
                onClick={routeToHome}
              >
                <img src={logo} className={styles.logo} alt="logo" />
                <IonText color="primary">
                  <span className={styles['brand-name']}>BuddyNUS</span>
                </IonText>
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
                      color={
                        pathName.includes(NOTIFICATIONS) ? 'primary' : 'dark'
                      }
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
          <IonContent fullscreen>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <IonRouterOutlet className={styles['desktop-wrapper']}>
                <UnauthenticatedRoute
                  exact
                  path={LOGIN}
                  component={LoginPage}
                />
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
                  path={CHANGE_COVER_PHOTO}
                  component={CoverPhotoSelectionPage}
                />
                <AuthenticatedRoute
                  exact
                  path={CAMPAIGN}
                  component={Campaigns}
                />
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
                <AuthenticatedRoute
                  exact
                  path={SESSIONS}
                  component={Sessions}
                />
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
                <Route exact path="/" component={Home} />
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <br></br>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonRouterOutlet>
            )}
          </IonContent>

          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
}

export default DesktopNavbar;
