import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { locationEnumToStr, Post } from "../../api/types";
import {
  convertDateRangeToTimeRangeStr,
  convertDateToDateStr,
} from "../../util/dateUtils";
import styles from "./styles.module.scss";

interface PostDetailsProps {
  post: Post;
}

// export const mockPost: Post = {
//   id: "postid",
//   poster: mockPoster,
//   startDateTime: "29 Sep",
//   endDateTime: "29 Sep",
//   personCapacity: 2,
//   /** List of users who have been confirmed to be going for the post event */
//   participants: [mockUser2, mockUser2],
//   location: Location.CLB,
//   description: "Hi, I will be at CLB lvl 4! Feel free to come!",
// };

export default function PostDetails({ post }: PostDetailsProps) {
  return (
    <IonGrid className="ion-margin-vertical">
      <IonRow
        className={
          styles["bold"] + " ion-justify-content-start ion-padding-start"
        }
      >
        <IonCol>Details</IonCol>
      </IonRow>
      <IonRow className="ion-padding-start ion-justify-content-center">
        <IonCol>Venue</IonCol>
        <IonCol>
          {locationEnumToStr(post.location) ?? "unknown location"}
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding-start">
        <IonCol>Date</IonCol>{" "}
        {/* TODO: Confirm format of date time passed in and split accordingly */}
        <IonCol>{convertDateToDateStr(post.startDateTime)}</IonCol>
      </IonRow>
      <IonRow className="ion-padding-start">
        <IonCol>Time</IonCol>
        <IonCol>
          {convertDateRangeToTimeRangeStr(post.startDateTime, post.endDateTime)}
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding">
        <IonCol>{post.description ?? "No description"}</IonCol>
      </IonRow>
    </IonGrid>
  );
}
