import { IonItem } from '@ionic/react';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { facultyEnumToStr, locationEnumToStr, Post } from '../../api/types';
import PostModal from '../../pages/PostModal';
import {
  convertDateRangeToTimeRangeStr,
  convertDateToDateStr,
} from '../../util/dateUtils';
import styles from './styles.module.scss';

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  const [isModalOpen, setIsModalOpen] =
    useStateWithCallbackLazy<boolean>(false);
  const closeModal = (callback: () => void) => {
    setIsModalOpen(false, callback);
  };
  return (
    <IonItem
      className="ion-margin"
      button
      onClick={() => {
        setIsModalOpen(true, () => {
          return;
        });
      }}
    >
      <div className={styles['post-container']}>
        <h3 className="ion-no-margin">
          {convertDateToDateStr(post.startDateTime)}
        </h3>
        <h3 className="ion-no-margin">
          {convertDateRangeToTimeRangeStr(post.startDateTime, post.endDateTime)}
        </h3>
        <p className={styles['post-text-location']}>
          {locationEnumToStr(post.location)}
        </p>
        <br />
        <p className={styles['post-text']}>{post.description}</p>
        <br />
        <p className={styles['post-text']}>{post.poster.name}</p>
        <p className={styles['post-text']}>
          Y{post.poster.year},{` ${facultyEnumToStr(post.poster.faculty)}`}
        </p>
      </div>
      <PostModal isOpen={isModalOpen} onClose={closeModal} applyPost={post} />
    </IonItem>
  );
}
