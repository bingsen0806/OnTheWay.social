import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { locationEnumToStr, Post } from "../../api/types";
import { arrowBackOutline } from "ionicons/icons";
import PostDetails from "../../components/PostDetails";
import AboutPoster from "../../components/AboutPoster";
import OtherStudyBuddies from "../../components/OtherStudyBuddies";
import { createAppliedRequest } from "../../api/appliedRequests";
import useCheckedErrorHandler from "../../util/hooks/useCheckedErrorHandler";
import useUnknownErrorHandler from "../../util/hooks/useUnknownErrorHandler";
import { useState } from "react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  applyPost: Post;
}

// export const mockCreatedRequest: CreatedRequest = {
//   post: mockPost,
//   applicants: [mockUser2, mockUser3],
// };

export default function ApplyModal({
  isOpen,
  onClose,
  applyPost,
}: ApplyModalProps) {
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleApply(postId: string) {
    setIsLoading(true);
    createAppliedRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message );
        } else {
          setIsApplied(true);
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        console.log("applied api called!");
        setIsLoading(false);
      });
  }

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Study Session @ {locationEnumToStr(applyPost.location) ?? "UNKNOWN"}
          </IonTitle>
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
        {isApplied ? (
          <IonButton
            className="ion-padding-horizontal"
            fill="clear"
            color="success"
            expand="block"
            disabled={true}
            size="large"
          >
            Applied
          </IonButton>
        ) : (
          <IonButton
            className="ion-padding-horizontal"
            expand="block"
            size="large"
            onClick={() => {
              handleApply(applyPost.id);
            }}
          >
            Apply
          </IonButton>
        )}
      </IonContent>
      <IonLoading isOpen={isLoading}></IonLoading>
    </IonModal>
  );
}
