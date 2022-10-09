import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, person, search } from "ionicons/icons";
import Home from "./pages/home";
import Posts from "./pages/posts";
import Profile from "./pages/profile";
import Faq from "./pages/faq";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.scss";
import styles from "./styles.module.scss";

import {
  CREATE_POST,
  EMAIL_VERIFICATION,
  FAQ,
  HOME,
  LOGIN,
  POSTS,
  PROFILE,
  PROFILE_CREATION,
  REGISTER,
} from "./routes";
import { AuthProvider } from "./util/authentication";
import AuthenticatedRoute from "./util/authentication/AuthenticatedRoute";
import UnauthenticatedRoute from "./util/authentication/UnauthenticatedRoute";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import EmailVerificationPage from "./pages/authentication/EmailVerificationPage";
import ProfileCreationPage from "./pages/authentication/ProfileCreationPage";
import CreatePostPage from "./pages/posts/CreatePostPage";
import ApplyModal from "./pages/apply";
import PosterViewRequest from "./pages/posterViewRequest";
import AppliedPostStatus from "./pages/appliedPostStatus";

setupIonicReact();

export default function App() {
  return (
    <AuthProvider>
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

              <AuthenticatedRoute
                exact
                path={EMAIL_VERIFICATION}
                component={EmailVerificationPage}
              />
              <Route
                exact
                path={PROFILE_CREATION}
                component={ProfileCreationPage}
              />
              <AuthenticatedRoute exact path={HOME} component={Home} />
              <Route exact path={POSTS} component={Posts} />
              <Route exact path={CREATE_POST} component={CreatePostPage} />
              <Route exact path="/apply" component={ApplyModal} />
              <Route exact path="/posterView" component={PosterViewRequest} />
              <Route exact path="/appliedPost" component={AppliedPostStatus} />
              <AuthenticatedRoute exact path={PROFILE} component={Profile} />
              <Route exact path={FAQ} component={Faq} />
              <Route exact path="/">
                <Redirect to={HOME} />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href={HOME}>
                <IonIcon icon={home} />
                <IonLabel className={styles["tab-button-text"]}>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="posts" href={POSTS}>
                <IonIcon icon={search} />
                <IonLabel className={styles["tab-button-text"]}>Posts</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href={PROFILE}>
                <IonIcon icon={person} />
                <IonLabel className={styles["tab-button-text"]}>
                  Profile
                </IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
}
