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
import { AppliedRequest, AppliedRequestStatus, User } from "../../api/types";
import { arrowBackOutline } from "ionicons/icons";
import PostDetails, { mockPost } from "../../components/PostDetails";
import AboutPoster from "../../components/AboutPoster";
import RequestStatus from "../../components/RequestStatus";

interface AppliedPostStatusProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  appliedRequest: AppliedRequest;
}

async function handleCancel() {
  await Promise.resolve();
  console.log("cancelled!");
}

export const mockAppliedRequest: AppliedRequest = {
  post: mockPost,
  status: AppliedRequestStatus.ACCEPTED,
};

export default function AppliedPostStatus({
  isOpen,
  onClose,
  currentUser,
  appliedRequest = mockAppliedRequest,
}: AppliedPostStatusProps) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Study Session @ CLB</IonTitle>
          <IonButtons>
            <IonButton slot="start" fill="clear" color="dark" onClick={onClose}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              <p>Back</p>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <RequestStatus
          status={appliedRequest.status}
          telegramHandle={appliedRequest.post?.poster?.telegramHandle}
        />
        <PostDetails post={appliedRequest.post} />
        <AboutPoster poster={appliedRequest.post?.poster} />
        <IonButton
          className="ion-padding-horizontal"
          expand="block"
          size="large"
          fill="outline"
          color="medium"
          onClick={() => {
            void handleCancel();
          }}
        >
          Cancel
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
