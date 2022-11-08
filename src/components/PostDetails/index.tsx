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
    <IonGrid
      className={`${isAuthenticated ? styles['margin'] : ''} ion-no-padding`}
    >
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
        <IonCol>{convertDateToDateStr(post.startDateTime)}</IonCol>
      </IonRow>
      <IonRow>
        <IonCol>Time</IonCol>
        <IonCol>
          {convertDateRangeToTimeRangeStr(post.startDateTime, post.endDateTime)}
        </IonCol>
      </IonRow>
      {isAuthenticated && (
        <IonRow className="ion-padding-top">
          <IonCol>Description</IonCol>
          <IonCol size="12">
            <p>{post.description}</p>
          </IonCol>
        </IonRow>
      )}
    </IonGrid>
  );
}
