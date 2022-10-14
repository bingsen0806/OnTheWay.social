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
      button
      onClick={() => {
        setIsModalOpen(true, () => {
          return;
        });
      }}
    >
      <div className={styles['post-container']}>
        <p className={styles['post-text']}>
          {locationEnumToStr(post.location)}
        </p>
        <p className={styles['post-text']}>
          {convertDateToDateStr(post.startDateTime)}
          {', '}
          {convertDateRangeToTimeRangeStr(post.startDateTime, post.endDateTime)}
        </p>
        <p className={styles['post-text']}>
          {`${post.participants.length.toString()} ${
            post.participants.length <= 1 ? 'attendee' : 'attendees'
          }`}
        </p>
        <br></br>
        <p className={styles['post-text']}>{post.description}</p>
        <br></br>
        <p className={styles['post-text']}>{post.poster.name}</p>
        <p className={styles['post-text']}>
          Y{post.poster.year}/{` ${facultyEnumToStr(post.poster.faculty)}`}
        </p>
      </div>
      <PostModal isOpen={isModalOpen} onClose={closeModal} applyPost={post} />
    </IonItem>
  );
}
