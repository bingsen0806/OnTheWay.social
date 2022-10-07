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
import React, { useRef, useState } from "react";
import { uploadImage } from "../../api/user";

interface Image {
  preview: string;
  raw: File[];
}

export default function ProfilePage() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const inputFile = useRef<HTMLInputElement>(null);
  const dummyImage: Image = {
    preview: "",
    raw: [],
  };
  const [image, setImage] = useState(dummyImage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: [file],
      });
      void uploadImage().then(getUser);
    }
  };

  const openUpload = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  const getUser = () => {
    const auth = getAuth();
    if (auth.currentUser?.uid) {
      void dispatch(getUserObject(auth.currentUser.uid));
    }
  };

  useIonViewDidEnter(() => {
    getUser();
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
                  <input
                    ref={inputFile}
                    type="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    onChange={handleChange}
                  />
                  {image.preview ? (
                    <IonAvatar
                      onClick={openUpload}
                      className={styles["avatar"]}
                    >
                      <img alt="profile" src={image.preview} />
                    </IonAvatar>
                  ) : (
                    <IonAvatar
                      onClick={openUpload}
                      className={styles["avatar"]}
                    >
                      <img alt="profile" src={imageURL} />
                    </IonAvatar>
                  )}

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
