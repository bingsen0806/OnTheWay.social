import {
  getPlatforms,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow,
} from '@ionic/react';
import { calendarClearOutline, timeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { facultyEnumToStr, locationEnumToStr, Post } from '../../api/types';
import PostModal from '../../pages/PostModal';
import { useAuthState } from '../../util/authentication';
import {
  convertDateRangeToTimeRangeStr,
  convertDateToDateStr,
} from '../../util/dateUtils';
import LocationImage from '../LocationImage';
import styles from './styles.module.scss';

interface PostListItemProps {
  post: Post;
  selected: boolean;
  onClick: (post: Post) => void;
  infoOnly?: boolean; // whether to show post with no actions, just show info
}

export default function PostListItem({
  post,
  selected,
  onClick,
  infoOnly,
}: PostListItemProps) {
  const [isModalOpen, setIsModalOpen] =
    useStateWithCallbackLazy<boolean>(false);

  const history = useHistory();
  const closeModal = (callback: () => void) => {
    setIsModalOpen(false, callback);
  };
  const isMobile = getPlatforms().includes('mobile');
  const { isAuthenticated } = useAuthState();
  return (
    <IonItem
      color={selected && !isMobile ? 'tertiary' : ''}
      button
      onClick={() => {
        history.push({ search: '?modal=true' });
        setIsModalOpen(true, () => {
          return;
        });
        onClick(post);
      }}
      detail={false}
      className={selected ? styles['selected-item'] : ''}
    >
      <IonGrid>
        <IonRow className="ion-align-items-center">
          <IonCol size="4">
            <LocationImage location={post.location}></LocationImage>
          </IonCol>
          <IonCol size="1"></IonCol>
          <IonCol size="7">
            <div>
              <p className={styles['post-text-location']}>
                {locationEnumToStr(post.location)}
              </p>
              <p className={styles['key-details-text']}>
                <IonIcon icon={calendarClearOutline} />{' '}
                {convertDateToDateStr(post.startDateTime)}
              </p>
              <p className={styles['key-details-text']}>
                <IonIcon icon={timeOutline} />{' '}
                {convertDateRangeToTimeRangeStr(
                  post.startDateTime,
                  post.endDateTime
                )}
              </p>
              {isAuthenticated && (
                <>
                  <p className={styles['post-text']}>{post.poster.name}</p>
                  <p className={styles['post-text']}>
                    Y{post.poster.year},
                    {` ${facultyEnumToStr(post.poster.faculty)}`}
                  </p>
                </>
              )}
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
      {(isMobile || infoOnly) && (
        <PostModal
          infoOnly={infoOnly}
          isOpen={isModalOpen}
          onClose={closeModal}
          applyPost={post}
        />
      )}
    </IonItem>
  );
}
