import { IonItem } from '@ionic/react';
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
      <div className="ion-padding-top">
        <h3 className="ion-no-margin">{locationEnumToStr(post.location)}</h3>
        <p className={styles['key-details-text']}>
          {convertDateToDateStr(post.startDateTime)}
        </p>
        <p className={styles['key-details-text']}>
          {convertDateRangeToTimeRangeStr(post.startDateTime, post.endDateTime)}
        </p>
        <p className={styles['post-text']}>
          {post.description.length <= DESCRIPTION_WORD_LIMIT
            ? post.description
            : post.description.slice(0, DESCRIPTION_WORD_LIMIT - 3) + '...'}
        </p>
        <br />
        <p className={styles['post-text']}>{post.poster.name}</p>
        <p className={styles['post-text']}>
          Y{post.poster.year},{` ${facultyEnumToStr(post.poster.faculty)}`}
        </p>
      </div>
      <PostModal isOpen={isModalOpen} onClose={closeModal} applyPost={post} />
      <div slot="end">
        <LocationImage location={post.location}></LocationImage>
      </div>
    </IonItem>
  );
}
