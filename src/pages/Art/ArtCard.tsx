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
import { Art } from '../../api/types';
import MultiButtonOverlay from '../../components/MultiButtonOverlay';
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
  const publicProfileButton = art.isPublic
    ? {
        name: 'Hide from public profile',
        action: () => {
          /*TODO: replace w api*/ console.log('Hide art from profile');
        },
      }
    : {
        name: 'Show on public profile',
        action: () => {
          /*TODO:*/ console.log('Show on public profile');
        },
      };
  const coverButton = {
    name: 'Set as cover photo',
    action: () => {
      /*TODO:*/ console.log('Set as cover photo');
    },
  };
  const deleteButton = {
    name: 'Delete',
    action: () => {
      /*TODO:*/ console.log('delete');
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
      ></MultiButtonOverlay>
    </IonCard>
  );
}
