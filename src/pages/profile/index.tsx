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
} from "@ionic/react";
import styles from "./styles.module.scss";
import { useHistory } from "react-router";
import { FAQ } from "../../routes";

export default function ProfilePage() {
  const history = useHistory();

  // const dispatch = useAppDispatch();
  function submitLogout() {
    // try {
    //   await logout();
    // } catch (error) {
    // } finally {
    //   persistor.purge();
    //   dispatch({ type: 'USER_LOGOUT' });
    // }
  }

  const routeToFAQ = () => {
    history.push(FAQ);
  };

  const imageURL =
    "https://images.unsplash.com/photo-1594751543129-6701ad444259?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFyayUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80";
  const username = "USERNAME";

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
