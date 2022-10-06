import {
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonCol,
  IonAvatar,
  useIonViewDidEnter,
} from "@ionic/react";
import styles from "./styles.module.scss";
import { useHistory } from "react-router";
import { FAQ } from "../../routes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUserObject } from "../../redux/slices/userSlice";
import { getAuth } from "firebase/auth";
import { logout } from "../../api/authentication";

export default function ProfilePage() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  useIonViewDidEnter(() => {
    const auth = getAuth();
    if (auth.currentUser?.uid) {
      void dispatch(getUserObject(auth.currentUser.uid));
    }
  });

  function submitLogout() {
    void logout();
  }

  const routeToFAQ = () => {
    history.push(FAQ);
  };

  const imageURL = user.thumbnailPhoto;
  const username = user.name;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol
              size="11"
              sizeMd="8"
              sizeLg="6"
              sizeXl="4"
              className="ion-no-padding"
            >
              <IonGrid>
                <IonRow className="ion-align-items-center">
                  <IonAvatar>
                    <img alt="profile" src={imageURL} />
                  </IonAvatar>

                  <p className="ion-padding">{username}</p>
                </IonRow>
              </IonGrid>

              <IonList lines="none">
                <IonItem>
                  <IonLabel onClick={routeToFAQ} className={styles["pointer"]}>
                    <h1>FAQ</h1>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel
                    className={styles["pointer"]}
                    onClick={submitLogout}
                  >
                    <h1>Log out</h1>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
