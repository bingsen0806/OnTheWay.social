import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { setCover } from '../../api/art';
import { Art } from '../../api/types';
import FullScreenLoadingSpinner from '../../components/FullScreenLoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setProfilePhotoInRedux } from '../../redux/slices/userSlice';
import useInfoToast from '../../util/hooks/useInfoToast';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import styles from './styles.module.scss';

export default function CoverPhotoSelectionPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const art = useAppSelector((root) => root.user.user.art);
  const dispatch = useAppDispatch();
  const handleUnknownError = useUnknownErrorHandler();
  const presentInfoToast = useInfoToast();

  async function handlePicClick(art: Art) {
    try {
      setIsLoading(true);
      const resp = await setCover(art.id);
      if (!resp.success) {
        handleUnknownError(resp.message);
      }
      dispatch(setProfilePhotoInRedux(art));
      presentInfoToast('This art piece is now your cover photo');
    } catch (error) {
      handleUnknownError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <h1
            slot="start"
            className={`ion-padding-start ${styles['art-header-text']}`}
          >
            Cover Photo
          </h1>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-text-center">
        {isLoading ? (
          <FullScreenLoadingSpinner />
        ) : (
          <>
            <h2 className="ion-padding-start">
              Choose a cover photo from your own personal art pieces!
            </h2>
            <p className="ion-padding-start">
              Art pieces are randomly created as you create, apply and accept
              study sessions. These art pieces are AI-generated and owned
              exclusively by you in the entire world.
            </p>
            {!art || art?.length === 0 ? (
              <p className="ion-padding-start">
                You don't have any art at the moment!
              </p>
            ) : (
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  {art.map((artPiece) => (
                    <IonCol size="3" sizeLg="2" key={artPiece.id}>
                      <IonImg
                        className={styles['cover-selection-image']}
                        src={artPiece.image}
                        onClick={() => void handlePicClick(artPiece)}
                      ></IonImg>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
