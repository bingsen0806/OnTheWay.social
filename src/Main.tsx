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
  CAMPAIGN,
  CREATE_POST,
  EMAIL_VERIFICATION,
  FAQ,
  HOME,
  LOGIN,
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
import Campaigns from './pages/campaigns';
setupIonicReact();

export default function Main() {
  const { isAuthenticated } = useAuthState();
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
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href={HOME}>
              <IonIcon icon={home} />
              <IonLabel className={styles['tab-button-text']}>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="createPost" href={CREATE_POST}>
              <IonIcon icon={addCircleSharp} />
              <IonLabel className={styles['tab-button-text']}>Create</IonLabel>
            </IonTabButton>
            {isAuthenticated && (
              <IonTabButton tab="sessions" href={SESSIONS}>
                <IonIcon icon={book} />
                <IonLabel className={styles['tab-button-text']}>
                  Your sessions
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
