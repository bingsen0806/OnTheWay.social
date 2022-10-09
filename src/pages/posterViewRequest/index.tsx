import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { CreatedRequest } from "../../api/types";
import { arrowBackOutline } from "ionicons/icons";
import PostDetails from "../../components/PostDetails";
import ApplicantList from "../../components/ApplicantList";
import { mockCreatedRequest } from "../apply";

interface PosterViewRequestProps {
  isOpen: boolean;
  onClose: () => void;
  createdRequest: CreatedRequest;
}

async function handleDelete() {
  //TODO
  await Promise.resolve();
  console.log("applied!");
}

export default function PosterViewRequest({
  isOpen,
  onClose,
  createdRequest = mockCreatedRequest,
}: PosterViewRequestProps) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Study Session @ CLB</IonTitle>
          <IonButtons>
            <IonButton slot="start" fill="clear" color="dark">
              <IonIcon icon={arrowBackOutline} slot="start" />
              <p>Back</p>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <PostDetails post={createdRequest.post} />
        <ApplicantList applicants={createdRequest.applicants} />
        <IonButton
          className="ion-padding-horizontal ion-margin-top"
          expand="block"
          fill="outline"
          color="medium"
          size="large"
          onClick={() => {
            void handleDelete();
          }}
        >
          Delete Request
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
