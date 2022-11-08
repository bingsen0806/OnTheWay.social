import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/react';
import styles from './styles.module.scss';
import { useHistory } from 'react-router';
import { ABOUT_ART, ART, FEEDBACK, PROFILE_FAQ } from '../../routes';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getInitialSelf, reloadSelf } from '../../redux/slices/userSlice';
import { logout } from '../../api/authentication';
import React, { useRef, useState } from 'react';
import { uploadImageAndStoreToDb } from '../../api/user';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { persistor } from '../../redux/store';
import { requestReloadOfHomeData } from '../../redux/slices/homeSlice';
import { requestReloadOfPosts } from '../../redux/slices/postsSlice';
import useInfoToast from '../../util/hooks/useInfoToast';
import ProfileHeader from '../../components/ProfileHeader';
import usePageInitialLoad from '../../util/hooks/usePageInitialLoad';
import FullScreenLoadingSpinner from '../../components/FullScreenLoadingSpinner';
import PublicProfileContents from '../PublicProfileModal/PublicProfileContents';

interface Image {
  preview: string;
  raw: File[];
}

export default function ProfilePage() {
  console.log(35, 'hello');
  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId');
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const user = useAppSelector((state) => state.user.user);
  const inputFile = useRef<HTMLInputElement>(null);
  const dummyImage: Image = {
    preview: '',
    raw: [],
  };
  const [image, setImage] = useState(dummyImage);
  const presentInfoToast = useInfoToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024;
      console.log(57, fileSize);
      if (fileSize > 10) {
        presentInfoToast('File size cannot be more than 10MB', 'danger');
        return;
      }
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: [file],
      });
      const successCallback = () => {
        presentInfoToast('Successfully changed profile photo!');
        getUser();
      };
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
    void dispatch(reloadSelf());
  };

  const routeToFeedback = () => {
    window.open(FEEDBACK, '_blank');
  };

  usePageInitialLoad(() => {
    dispatch(getInitialSelf())
      .unwrap()
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message as string);
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      });
  });

  function submitLogout() {
    logout()
      .then(() => {
        void persistor.purge();
        dispatch({ type: 'USER_LOGOUT' });
        dispatch(requestReloadOfHomeData());
        dispatch(requestReloadOfPosts());
      })
      .catch((error) => {
        handleUnknownError(error);
      });
  }

  if (userId) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <PublicProfileContents userId={userId} />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {isLoading ? (
          <FullScreenLoadingSpinner />
        ) : (
          <>
            <ProfileHeader
              thumbnailPhoto={
                image.preview ? image.preview : user.thumbnailPhoto
              }
              profilePhoto={user.profilePhoto}
              editThumbnailHandler={openUpload}
            ></ProfileHeader>
            <IonGrid className={styles['grid-container']}>
              <IonRow>
                <IonCol className="ion-padding-start">
                  <h1>{user.name}</h1>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" sizeMd="6" sizeLg="4" sizeXl="3">
                  <input
                    accept="image/*"
                    ref={inputFile}
                    type="file"
                    id="upload-button"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                  />
                  <IonList lines="none">
                    <IonItem
                      button
                      routerLink={
                        user.art && user.art.length > 0 ? ART : ABOUT_ART
                      }
                    >
                      <IonLabel className={styles['pointer']}>
                        <h1>Art</h1>
                      </IonLabel>
                    </IonItem>
                    <IonItem button routerLink={PROFILE_FAQ}>
                      <IonLabel className={styles['pointer']}>
                        <h1>FAQ</h1>
                      </IonLabel>
                    </IonItem>
                    <IonItem button onClick={routeToFeedback}>
                      <IonLabel className={styles['pointer']}>
                        <h1>Feedback</h1>
                      </IonLabel>
                    </IonItem>
                    <IonItem button onClick={submitLogout}>
                      <IonLabel className={styles['pointer']}>
                        <h1>Log out</h1>
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol
                  onClick={() => {
                    history.push(ABOUT_ART);
                  }}
                  className={styles['profile-art-banner-container']}
                  sizeMd="6"
                  sizeLg="4"
                  sizeXl="3"
                >
                  <IonImg src="assets/images/profile-art-banner.png"></IonImg>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
