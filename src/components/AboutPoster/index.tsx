import { IonAvatar, IonCol, IonGrid, IonRow } from "@ionic/react";
import { Faculty, Gender, User } from "../../api/types";
import styles from "./styles.module.scss";

interface AboutPosterProps {
  poster: User;
}

export default function AboutPoster({ poster }: AboutPosterProps) {
  return (
    <div onClick={() => console.log("hi poster")}>
      <IonGrid className="ion-margin-vertical">
        <IonRow
          className={
            styles["header"] + " ion-justify-content-start ion-padding-start"
          }
        >
          <IonCol>About the poster</IonCol>
        </IonRow>
        <IonRow className="ion-padding-start ion-justify-content-center">
          <IonCol size="3">
            <IonAvatar className={styles["avatar"]}>
              <img alt="profilePic" src={poster.profilePhoto} />{" "}
              {/*TODO: Use default photo url if user does not have profile photo */}
            </IonAvatar>
          </IonCol>
          <IonCol className={styles["user-info"]}>
            <IonRow className={styles["bold"]}>
              {poster.name ?? "No Name"}
            </IonRow>
            <IonRow>
              Y{poster.year ?? 0}/{Faculty[poster.faculty] ?? "unknown faculty"}
            </IonRow>
            <IonRow>{Gender[poster.gender] ?? "unknown gender"}</IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
}
