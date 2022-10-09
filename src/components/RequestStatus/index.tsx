import { IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { AppliedRequestStatus } from "../../api/types";
import { copyOutline } from "ionicons/icons";
import styles from "./styles.module.scss";

interface RequestStatusProps {
  status: AppliedRequestStatus;
  telegramHandle: string;
}

const getCssClass = (status: AppliedRequestStatus) => {
  switch (status) {
    case AppliedRequestStatus.ACCEPTED:
      return "status-accepted";
    case AppliedRequestStatus.PENDING:
      return "status-pending";
    case AppliedRequestStatus.REJECTED:
      return "status-rejected";
    default:
      return "status-unknown";
  }
};

export default function RequestStatus({
  status,
  telegramHandle,
}: RequestStatusProps) {
  return (
    <div onClick={() => console.log("hi")}>
      <IonGrid className="ion-margin-vertical">
        <IonRow
          className={
            styles["non-bold-header"] +
            " ion-padding-start ion-justify-content-start"
          }
        >
          <IonCol>Status:</IonCol>
          <IonCol className={styles[getCssClass(status)]}>
            {AppliedRequestStatus[status] ?? "unknown status"}
          </IonCol>
        </IonRow>
        <IonRow
          className={
            styles["non-bold-header"] +
            " ion-padding-start ion-justify-content-start"
          }
        >
          <IonCol>Telegram:</IonCol>
          <IonCol className="ion-no-padding">
            {telegramHandle ?? "No telegram"}
            <IonIcon
              className={styles["copy-icon"]}
              icon={copyOutline}
              onClick={() => {
                void navigator.clipboard.writeText(telegramHandle);
              }}
            />
          </IonCol>
        </IonRow>
        <IonRow className="ion-padding-start ion-justify-content-cente">
          <IonCol>
            Contact the poster via telegram to coordinate your meetup!
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
}
