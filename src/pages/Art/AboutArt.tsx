import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from '@ionic/react';

export default function AboutArtPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <h1 className="ion-padding-start ion-no-margin">About Art</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding-start">
          <h2>
            Get your very first piece of digital art that you exclusively own!
          </h2>
          <p>
            Everytime you create, apply for a study session or accept an
            applicant, you have a chance of receiving an AI-generated piece of
            art owned exclusively by you. This art is publicly visible by other
            users and can be shared on your social media or exported as an NFT.
            Own your very first NFT today!
          </p>
          <p>
            What you get every time is completely random. It could be a
            masterpiece, or it could be less than aesthetic. Thats part of the
            joy!
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
}
