import {
  IonCard,
  IonImg,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  getPlatforms,
} from '@ionic/react';
import { shareOutline, shareSocialOutline, menu } from 'ionicons/icons';
import { useState } from 'react';
import { RWebShare } from 'react-web-share';
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

const shareText =
  'Check out my AI-generated art piece that is owned exclusively by me on BuddyNUS!';

const title = 'Share your AI-generated art!';

export default function ArtCard({ art, isCover }: ArtCardProps) {
  const isIOS = getPlatforms().includes('ios');
  const [isOverlayShowing, setIsOverlayShowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleUnknownError = useUnknownErrorHandler();
  const presentInfoToast = useInfoToast();
  const dispatch = useAppDispatch();
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
              'This art piece is now hidden on your public profile'
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
      <IonCardHeader className={styles['description']}>
        <IonCardSubtitle>{art.description}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="1" className={styles['share-button-container']}>
              <RWebShare data={{ text: shareText, title, url: art.image }}>
                <IonIcon
                  icon={isIOS ? shareOutline : shareSocialOutline}
                  className={styles['share']}
                ></IonIcon>
              </RWebShare>
            </IonCol>
            <IonCol size="1">
              <IonButton
                fill="clear"
                className={styles['menu-button']}
                onClick={() => {
                  setIsOverlayShowing(true);
                }}
              >
                <IonIcon color="dark" icon={menu} />
              </IonButton>
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
