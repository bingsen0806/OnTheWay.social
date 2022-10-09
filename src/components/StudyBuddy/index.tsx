import { IonCol, IonRow } from "@ionic/react";
import { Faculty, Gender, User } from "../../api/types";
import styles from "./styles.module.scss";

interface StudyBuddyProps {
  buddy: User;
}

export default function StudyBuddy({ buddy }: StudyBuddyProps) {
  return (
    <div className={styles["study-buddy"]}>
      <IonRow className="ion-padding-start ion-justify-content-center">
        <IonCol className={styles["bold"]}>{buddy.name ?? "No name"}</IonCol>
      </IonRow>
      <IonRow className="ion-padding-start ion-justify-content-center">
        <IonCol>
          Y{buddy.year ?? 0}/{Faculty[buddy.faculty] ?? "unknown faculty"}
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-start ion-justify-content-center">
        <IonCol>{Gender[buddy.gender] ?? "unknown gender"}</IonCol>
      </IonRow>
    </div>
  );
}
