import { IonCol, IonGrid, IonIcon, IonItem, IonRow } from '@ionic/react';
import { calendarClearOutline, timeOutline } from 'ionicons/icons';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { facultyEnumToStr, locationEnumToStr, Post } from '../../api/types';
import PostModal from '../../pages/PostModal';
import {
  convertDateRangeToTimeRangeStr,
  convertDateToDateStr,
} from '../../util/dateUtils';
import LocationImage from '../LocationImage';
import styles from './styles.module.scss';

interface PostListItemProps {
  post: Post;
}

const DESCRIPTION_WORD_LIMIT = 28;

export default function PostListItem({ post }: PostListItemProps) {
  const [isModalOpen, setIsModalOpen] =
    useStateWithCallbackLazy<boolean>(false);
  const closeModal = (callback: () => void) => {
    setIsModalOpen(false, callback);
  };
  return (
    <IonItem
      className={styles['item-container']}
      button
      onClick={() => {
        setIsModalOpen(true, () => {
          return;
        });
      }}
      detail={false}
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
              <p className={styles['post-text']}>{post.poster.name}</p>
              <p className={styles['post-text']}>
                Y{post.poster.year},
                {` ${facultyEnumToStr(post.poster.faculty)}`}
              </p>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>

      <PostModal isOpen={isModalOpen} onClose={closeModal} applyPost={post} />
    </IonItem>
  );
}
