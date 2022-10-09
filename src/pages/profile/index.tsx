import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
  IonAvatar,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import styles from "./styles.module.scss";
import { useHistory } from "react-router";
import { FAQ } from "../../routes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getSelf } from "../../redux/slices/userSlice";
import { logout } from "../../api/authentication";
import React, { useRef, useState } from "react";
import { uploadImageAndStoreToDb } from "../../api/user";
import usePageInitialLoad from "../../util/hooks/usePageInitialLoad";
import useCheckedErrorHandler from "../../util/hooks/useCheckedErrorHandler";

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
  const handleCheckedError = useCheckedErrorHandler();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: [file],
      });
      const successCallback = getUser;
      const failedCallback = (error: string) => handleCheckedError(error);
      void uploadImageAndStoreToDb(user, file, successCallback, failedCallback);
    }
  };

  const openUpload = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  const getUser = () => {
    void dispatch(getSelf());
  };

  usePageInitialLoad(() => {
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
            <IonCol size="12" sizeMd="6" sizeLg="4" sizeXl="3">
              <IonCard>
                <IonCardContent>
                  <input
                    accept="image/*"
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

                  <IonCardHeader>
                    <h1 className={styles["username-text"]}>{username}</h1>
                  </IonCardHeader>
                  <IonList lines="none">
                    <IonItem>
                      <IonLabel
                        onClick={routeToFAQ}
                        className={styles["pointer"]}
                      >
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
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
