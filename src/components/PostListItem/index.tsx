import { IonItem } from '@ionic/react';
import { useState } from 'react';
import { facultyEnumToStr, locationEnumToStr, Post } from '../../api/types';
import {
  convertDateRangeToTimeRangeStr,
  convertDateToDateStr,
} from '../../util/dateUtils';
import styles from './styles.module.scss';

interface PostListItemProps {
  post: Post;
}

export default function PostListItem({ post }: PostListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  function closeModal() {
    setIsModalOpen(false);
  }
  return (
    <IonItem
      onClick={() => {
        setIsModalOpen(true);
      }}
    >
      <div className={styles['post-container']}>
        <p className={styles['post-text']}>
          Location: {locationEnumToStr(post.location)}
        </p>
        <p className={styles['post-text']}>
          When: {convertDateToDateStr(post.startDateTime)}
          {', '}
          {convertDateRangeToTimeRangeStr(post.startDateTime, post.endDateTime)}
        </p>
        <p className={styles['post-text']}>
          {post.participants.length + 1} / {post.personCapacity} pax
        </p>
        <p className={styles['post-text']}>Description: {post.description}</p>
        <br></br>
        <p className={styles['post-text']}>
          {post.poster.name}, Y{post.poster.year}{' '}
          {facultyEnumToStr(post.poster.faculty)}
        </p>
      </div>
    </IonItem>
  );
}
