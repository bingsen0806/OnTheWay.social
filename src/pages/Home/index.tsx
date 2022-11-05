import React from 'react';
import Cta from './Cta';
import Hero from './Hero';
import Info from './Info';
import { IonContent, IonPage } from '@ionic/react';
import { useAuthState } from '../../util/authentication';
import Posts from '../posts';
function Home() {
  const { isAuthenticated } = useAuthState();
  return (
    <>
      {isAuthenticated ? (
        <Posts />
      ) : (
        <IonPage>
          <IonContent fullscreen>
            <Hero />
            <Info />
            <Cta />
          </IonContent>
        </IonPage>
      )}
    </>
  );
}

export default Home;
