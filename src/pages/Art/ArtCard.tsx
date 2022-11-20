import {
  IonCard,
  IonImg,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  getPlatforms,
} from '@ionic/react';
import { shareOutline, shareSocialOutline, menu } from 'ionicons/icons';
import { useState } from 'react';
import { changeArtVisibility, deleteArt, setCover } from '../../api/art';
import { Art } from '../../api/types';
import MultiButtonOverlay from '../../components/MultiButtonOverlay';
import { useAppDispatch } from '../../redux/hooks';
import {
  editArtVisiblityFieldInRedux,
  removeArtFromRedux,
  setProfilePhotoInRedux,
} from '../../redux/slices/userSlice';
import useInfoToast from '../../util/hooks/useInfoToast';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import styles from './styles.module.scss';

export interface ArtCardProps {
  art: Art;
  isCover: boolean;
}

// const shareText =
//   'Check out my AI-generated art piece that is owned exclusively by me on OnTheWay!';

// const title = 'Share your AI-generated art!';

export default function ArtCard({ art, isCover }: ArtCardProps) {
  const isIOS = getPlatforms().includes('ios');
  const [isOverlayShowing, setIsOverlayShowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleUnknownError = useUnknownErrorHandler();
  const presentInfoToast = useInfoToast();
  const dispatch = useAppDispatch();
  const openShareDialog = async () => {
    const title = 'Check out my art in OnTheWay!';
    const text = 'I received an AI-generated art piece unique in the world';
    try {
      const blob = await fetch(art.image).then((res) => res.blob());
      const data = {
        files: [
          new File([blob], 'image.png', {
            type: blob.type,
          }),
        ],
        title,
        text,
      };
      await navigator.share(data);
    } catch (e) {
      console.log(e);
    }
  };

  const publicProfileButton = art.isPublic
    ? {
        name: 'Hide from public profile',
        action: async () => {
          try {
            setIsLoading(true);
            const resp = await changeArtVisibility(art.id, false);
            if (!resp.success) {
              handleUnknownError(resp.message);
            }
            dispatch(
              editArtVisiblityFieldInRedux({ artId: art.id, visibility: false })
            );
            presentInfoToast(
              'This art piece is now hidden from your public profile'
            );
          } catch (error) {
            handleUnknownError(error);
          } finally {
            setIsLoading(false);
          }
        },
      }
    : {
        name: 'Show on public profile',
        action: async () => {
          try {
            setIsLoading(true);
            const resp = await changeArtVisibility(art.id, true);
            if (!resp.success) {
              handleUnknownError(resp.message);
            }
            dispatch(
              editArtVisiblityFieldInRedux({ artId: art.id, visibility: true })
            );
            presentInfoToast(
              'This art piece is now visible on your public profile'
            );
          } catch (error) {
            handleUnknownError(error);
          } finally {
            setIsLoading(false);
          }
        },
      };
  const coverButton = {
    name: 'Set as cover photo',
    action: async () => {
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
    },
  };
  const deleteButton = {
    name: 'Delete',
    action: async () => {
      try {
        setIsLoading(true);
        const resp = await deleteArt(art.id);
        if (!resp.success) {
          handleUnknownError(resp.message);
        }
        dispatch(removeArtFromRedux(art.id));
        setIsOverlayShowing(false);
      } catch (error) {
        handleUnknownError(error);
      } finally {
        setIsLoading(false);
      }
    },
  };

  const multiButtons = isCover
    ? [publicProfileButton, deleteButton]
    : [publicProfileButton, coverButton, deleteButton];

  return (
    <IonCard key={art.id} className={styles['art-card']}>
      <IonImg src={art.image} className={styles['center-image']} />
      <IonCardContent>
        <IonGrid className="ion-no-padding ion-no-margin">
          <IonRow className="ion-justify-content-start ion-no-margin ion-no-padding">
            <IonCol size="1" className={styles['share-button-container']}>
              <IonIcon
                className={styles['share']}
                color="dark"
                icon={menu}
                onClick={() => {
                  setIsOverlayShowing(true);
                }}
              />
            </IonCol>
            {navigator.share !== undefined && (
              <IonCol size="1" className={styles['share-button-container']}>
                <IonIcon
                  icon={isIOS ? shareOutline : shareSocialOutline}
                  onClick={() => {
                    void openShareDialog();
                  }}
                  className={styles['share']}
                ></IonIcon>
              </IonCol>
            )}
            <IonCol size="12">
              <p className={styles['description']}>{art.description}</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
      <MultiButtonOverlay
        buttons={multiButtons}
        isShowing={isOverlayShowing}
        setIsShowing={(state) => {
          setIsOverlayShowing(state);
        }}
        isLoading={isLoading}
      ></MultiButtonOverlay>
    </IonCard>
  );
}
