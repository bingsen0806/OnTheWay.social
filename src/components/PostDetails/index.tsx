import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { locationEnumToStr, Post } from '../../api/types';
import { useAuthState } from '../../util/authentication';
import {
  convertDateRangeToTimeRangeStr,
  convertDateToDateStr,
} from '../../util/dateUtils';
import styles from './styles.module.scss';

interface PostDetailsProps {
  post: Post;
}

export default function PostDetails({ post }: PostDetailsProps) {
  const { isAuthenticated } = useAuthState();
  return (
    <IonGrid className={styles['margin']}>
      <IonRow className={styles['bold'] + ' ion-justify-content-start'}>
        <IonCol>Details</IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonCol>Venue</IonCol>
        <IonCol>
          {locationEnumToStr(post.location) ?? 'unknown location'}
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>Date</IonCol>{' '}
        {/* TODO: Confirm format of date time passed in and split accordingly */}
        <IonCol>{convertDateToDateStr(post.startDateTime)}</IonCol>
      </IonRow>
      <IonRow>
        <IonCol>Time</IonCol>
        <IonCol>
          {convertDateRangeToTimeRangeStr(post.startDateTime, post.endDateTime)}
        </IonCol>
      </IonRow>
      {isAuthenticated && <p className="ion-text-center">{post.description}</p>}
    </IonGrid>
  );
}
