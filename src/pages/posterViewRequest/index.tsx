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
import { CreatedRequest, locationEnumToStr } from "../../api/types";
import { arrowBackOutline } from "ionicons/icons";
import PostDetails from "../../components/PostDetails";
import ApplicantList from "../../components/ApplicantList";
import useCheckedErrorHandler from "../../util/hooks/useCheckedErrorHandler";
import useUnknownErrorHandler from "../../util/hooks/useUnknownErrorHandler";
import { useState } from "react";
import { cancelRequest } from "../../api/home";

interface PosterViewRequestProps {
  isOpen: boolean;
  onClose: () => void;
  createdRequest: CreatedRequest;
}

function getParticipantsFromCreatedRequest(createdRequest: CreatedRequest) {
  if (!createdRequest.post || !createdRequest.post.participants) {
    return [];
  }
  return createdRequest.post.participants.map((user) => user.id);
}

export default function PosterViewRequest({
  isOpen,
  onClose,
  createdRequest,
}: PosterViewRequestProps) {
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleDelete(postId: string) {
    setIsLoading(true);
    cancelRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          console.log("successfully deleted");
          setIsLoading(false);
          //TODO: Close modal or redirect back to pprevious page
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        console.log("delete applied request api called!");
        setIsLoading(false);
      });
  }

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Study Session @{" "}
            {locationEnumToStr(createdRequest?.post?.location) ?? "UNKNOWN"}
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
        <PostDetails post={createdRequest.post} />
        <ApplicantList
          postId={createdRequest.post.id}
          applicants={createdRequest.applicants}
          participants={getParticipantsFromCreatedRequest(createdRequest)}
        />
        <IonButton
          className="ion-padding-horizontal ion-margin-top"
          expand="block"
          fill="outline"
          color="medium"
          size="large"
          onClick={() => {
            void handleDelete(createdRequest.post?.id);
          }}
        >
          Delete Request
        </IonButton>
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonContent>
    </IonModal>
  );
}
