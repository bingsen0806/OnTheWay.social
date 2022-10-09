import { IonItem, IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import { useState } from "react";
import { cancelRequest } from "../../../../../api/home";
import { locationEnumToStr, CreatedRequest } from "../../../../../api/types";
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from "../../../../../util/dateUtils";
import PosterViewRequest from "../../../../posterViewRequest";
import styles from "../styles.module.scss";

interface CreatedRequestListItemProps {
  createdRequest: CreatedRequest;
}

export default function CreatedRequestListItem({
  createdRequest,
}: CreatedRequestListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  function sendCancellationRequest() {
    void cancelRequest(createdRequest.post.id);
    // TODO: error handling
  }

  return (
    <IonItem button onClick={() => setIsModalOpen(true)}>
      <IonGrid>
        <IonRow className="ion-justify-content-between">
          <IonCol>
            <p className={styles["post-text"]}>
              Location: {locationEnumToStr(createdRequest.post.location)}
            </p>
            <p className={styles["post-text"]}>
              When: {convertDateToDateStr(createdRequest.post.startDateTime)}
              {", "}
              {convertDateRangeToTimeRangeStr(
                createdRequest.post.startDateTime,
                createdRequest.post.endDateTime
              )}
            </p>
            <p className={styles["post-text"]}>
              {createdRequest.post.participants.length + 1} /{" "}
              {createdRequest.post.personCapacity} pax
            </p>
            <p className={styles["post-text"]}>
              Description: {createdRequest.post.description}
            </p>
          </IonCol>
          <IonCol
            size="4"
            sizeLg="auto"
            className={styles["created-request-col"]}
          >
            <b className="ion-padding-bottom ion-text-center">
              {createdRequest.applicants.length} pending applicants
            </b>
            <IonButton
              color="light"
              className="ion-no-margin"
              onClick={sendCancellationRequest}
            >
              Cancel
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <PosterViewRequest
        isOpen={isModalOpen}
        onClose={closeModal}
        createdRequest={createdRequest}
      />
    </IonItem>
  );
}
