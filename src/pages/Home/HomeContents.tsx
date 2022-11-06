import React from 'react';
import Cta from './Cta';
import Hero from './Hero';
import Info from './Info';
import { IonContent, IonPage } from '@ionic/react';

function HomeContents() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Hero />
        <Info />
        <Cta />
      </IonContent>
    </IonPage>
  );
}

export default HomeContents;
