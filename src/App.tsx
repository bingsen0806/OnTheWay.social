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
import { home, person, search } from 'ionicons/icons';
import Home from './pages/home';
import Posts from './pages/posts';
import Profile from './pages/profile';

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

import { HOME, POSTS, PROFILE } from './routes';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path={HOME}>
            <Home />
          </Route>
          <Route exact path={POSTS}>
            <Posts />
          </Route>
          <Route path={PROFILE}>
            <Profile />
          </Route>
          <Route exact path="/">
            <Redirect to={HOME} />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href={HOME}>
            <IonIcon icon={home} />
            <IonLabel className={styles['tab-button-text']}>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="posts" href={POSTS}>
            <IonIcon icon={search} />
            <IonLabel className={styles['tab-button-text']}>Posts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href={PROFILE}>
            <IonIcon icon={person} />
            <IonLabel className={styles['tab-button-text']}>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
