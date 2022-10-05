import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';

export default function PostsPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="ion-padding-start" slot="start">
            <h1>Study Sessions</h1>
            <p>
              Requests don't suit your schedule?{' '}
              <span>
                <u>Post a request</u>
              </span>
            </p>
          </div>
          <IonButton slot="end" fill="clear" color="dark">
            <IonIcon icon={funnelOutline} slot="start"></IonIcon>
            <p>Filter</p>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen></IonContent>
    </IonPage>
  );
}
