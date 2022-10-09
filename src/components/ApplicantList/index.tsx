import { IonCol, IonGrid, IonList, IonRow } from "@ionic/react";
import { User } from "../../api/types";
import SingleApplicant from "../SingleApplicant";
import styles from "./styles.module.scss";

interface ApplicantListProps {
  applicants: User[];
  participants: string[];
}

export default function ApplicantList({
  applicants,
  participants,
}: ApplicantListProps) {
  return (
    <IonGrid>
      <IonRow
        className={
          styles["header"] + " ion-justify-content-start ion-padding-start"
        }
      >
        <IonCol>Applicants</IonCol>
      </IonRow>
      <IonList>
        {applicants.map((applicant) => (
          <SingleApplicant
            applicant={applicant}
            key={applicant.id}
            isAccepted={participants.includes(applicant.id)}
          ></SingleApplicant> /*TODO: IMPORTANT, How to know whether applicant is accepted or not */
        ))}
      </IonList>
    </IonGrid>
  );
}
