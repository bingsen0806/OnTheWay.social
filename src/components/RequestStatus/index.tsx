import { IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { AppliedRequestStatus } from "../../api/types";
import { copyOutline } from "ionicons/icons";
import styles from "./styles.module.scss";

interface RequestStatusProps {
  status: AppliedRequestStatus;
  telegramHandle: string;
}

const getStatusLabel = (status: AppliedRequestStatus) => {
  switch (status) {
    case AppliedRequestStatus.ACCEPTED:
      return <IonCol className={styles["status-accepted"]}>Accepted!</IonCol>;
    case AppliedRequestStatus.PENDING:
      return <IonCol className={styles["status-pending"]}>Pending</IonCol>;
    case AppliedRequestStatus.REJECTED:
      return <IonCol className={styles["status-rejected"]}>Rejected</IonCol>;
    default:
      return (
        <IonCol className={styles["status-unknown"]}>Unknown Status</IonCol>
      );
  }
};

export default function RequestStatus({
  status,
  telegramHandle,
}: RequestStatusProps) {
  return (
    <IonGrid className="ion-margin-vertical">
      <IonRow
        className={
          styles["non-bold-header"] +
          " ion-padding-start ion-justify-content-start"
        }
      >
        <IonCol>Status:</IonCol>
        {getStatusLabel(status)}
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
  );
}
