import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { CreatedRequest, Post } from "../../api/types";
import { arrowBackOutline } from "ionicons/icons";
import PostDetails, { mockPost } from "../../components/PostDetails";
import AboutPoster from "../../components/AboutPoster";
import OtherStudyBuddies from "../../components/OtherStudyBuddies";
import { mockUser2 } from "../../components/SingleApplicant";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  applyPost: Post;
}

async function handleApply() {
  await Promise.resolve();
  console.log("applied!");
}

export const mockCreatedRequest: CreatedRequest = {
  post: mockPost,
  applicants: [mockUser2],
};

export default function ApplyModal({
  isOpen,
  onClose,
  applyPost,
}: ApplyModalProps) {
  return (
    <IonModal isOpen={isOpen}>
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
        <PostDetails post={applyPost} />
        <AboutPoster poster={applyPost?.poster} />
        <OtherStudyBuddies studyBuddies={applyPost.participants} />
        <IonButton
          className="ion-padding-horizontal"
          expand="block"
          onClick={() => {
            void handleApply();
          }}
        >
          Apply
        </IonButton>
      </IonContent>
    </IonModal>
  );
}
