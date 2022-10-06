import { IonItem } from '@ionic/react';
import moment from 'moment';
import { facultyEnumToStr, locationEnumToStr, Post } from '../../api/types';
import styles from './styles.module.scss';

interface PostListItemProps {
  post: Post;
}

function convertDateToDateStr(date: Date) {
  const momentDate = moment(date);
  if (momentDate.isSame(moment(), 'day')) {
    return 'Today';
  }
  return momentDate.format('DD MMM');
}

/**
 * Assuming dates are the same day, return the range in terms of hh:mm am/pm.
 * TODO: make sure can only allow sessions within same day.
 */
function convertDateRangeToTimeRangeStr(date1: Date, date2: Date) {
  return (
    moment(date1).format('hh:mm A') + ' - ' + moment(date2).format('hh:mm A')
  );
}

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <IonItem>
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
        <p className={styles['post-text']}>Description: {post.description};</p>
        <br></br>
        <p className={styles['post-text']}>
          {post.poster.name}, Y{post.poster.year}{' '}
          {facultyEnumToStr(post.poster.faculty)}
        </p>
      </div>
    </IonItem>
  );
}
