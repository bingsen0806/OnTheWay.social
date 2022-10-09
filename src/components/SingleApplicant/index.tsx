import { IonAvatar, IonButton, IonCol, IonRow } from "@ionic/react";
import { Faculty, Gender, User } from "../../api/types";
import styles from "./styles.module.scss";

interface SingleApplicantProps {
  applicant: User;
  isAccepted: boolean;
}

async function handleCancel() {
  //TODO
  await Promise.resolve();
  console.log("cancelled");
}

async function handleAccept() {
  //TODO
  await Promise.resolve();
  console.log("acccepted");
}

export const mockPoster: User = {
  id: "testid1",
  name: "Chun Yong",
  gender: Gender.MALE,
  faculty: Faculty.COMPUTING,
  telegramHandle: "chunyonggg",
  year: 4,
  profilePhoto:
    "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
  thumbnailPhoto:
    "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
};

export const mockUser2: User = {
  id: "testid2",
  name: "Bing Sen",
  gender: Gender.MALE,
  faculty: Faculty.BUSINESS,
  telegramHandle: "bingsennn",
  year: 3,
  profilePhoto:
    "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
  thumbnailPhoto:
    "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80",
};

export default function SingleApplicant({
  applicant,
  isAccepted,
}: SingleApplicantProps) {
  return (
    <IonRow className="ion-padding-start ion-justify-content-center">
      <IonCol size="3">
        <IonAvatar className={styles["avatar"]}>
          <img alt="profilePic" src={applicant.profilePhoto} />{" "}
          {/*TODO: Use default photo url if user does not have profile photo */}
        </IonAvatar>
      </IonCol>
      <IonCol className={styles["user-info"]}>
        <IonRow className={styles["bold"]}>
          {applicant.name ?? "No Name"}
        </IonRow>
        <IonRow>
          Y{applicant.year ?? 0}/
          {Faculty[applicant.faculty] ?? "unknown faculty"}
        </IonRow>
        <IonRow>{Gender[applicant.gender] ?? "unknown gender"}</IonRow>
        {isAccepted ? (
          <IonRow className={styles["bold"]}>
            Telegram: {applicant.telegramHandle ?? "No Telegram"}
          </IonRow>
        ) : (
          <></>
        )}
      </IonCol>
      <IonCol size="4" className={styles["accept-col"]}>
        {isAccepted ? (
          <>
            <IonRow className="ion-align-items-center">
              <IonButton
                disabled={true}
                shape="round"
                fill="outline"
                color="dark"
                size="small"
              >
                Accepted
              </IonButton>
            </IonRow>
            <IonRow className="ion-align-items-center">
              <IonButton
                shape="round"
                fill="clear"
                color="dark"
                size="small"
                onClick={() => {
                  void handleCancel();
                }}
              >
                Cancel
              </IonButton>
            </IonRow>
          </>
        ) : (
          <IonRow>
            <IonButton
              shape="round"
              fill="solid"
              size="small"
              onClick={() => {
                void handleAccept();
              }}
            >
              Accept
            </IonButton>
          </IonRow>
        )}
      </IonCol>
    </IonRow>
  );
}
