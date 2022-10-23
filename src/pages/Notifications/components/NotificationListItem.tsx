import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import {
  AppliedRequest,
  BuddyNotification,
  BuddyNotificationType,
  CreatedRequest,
  locationEnumToStr,
  Post,
} from '../../../api/types';
import { useAppDispatch } from '../../../redux/hooks';
import { markNotification } from '../../../redux/slices/notificationsSlice';
import {
  convertDateRangeToTimeRangeStr,
  convertDateToDateStr,
} from '../../../util/dateUtils';
import AppliedPostModal from '../../AppliedPostModal';
import CreatedPostModal from '../../CreatedPostModal';
import styles from './styles.module.scss';

interface NotificationListItemProps {
  notification: BuddyNotification;
}

export default function NotificationListItem({
  notification,
}: NotificationListItemProps) {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  function clickHandler() {
    // TODO: check if need any error handling here
    void dispatch(markNotification(notification.id));
    setIsModalOpen(true);
  }

  function getModalComponent() {
    switch (notification.type) {
      case BuddyNotificationType.APPLIED_TO_YOUR_POST:
      case BuddyNotificationType.CANCELLED_THEIR_APPLICATION:
        return (
          <CreatedPostModal
            isOpen={isModalOpen}
            onClose={closeModal}
            createdRequest={notification.data as CreatedRequest}
          ></CreatedPostModal>
        );
      case BuddyNotificationType.ACCEPTED_YOUR_APPLICATION:
        return (
          <AppliedPostModal
            isOpen={isModalOpen}
            onClose={closeModal}
            appliedRequest={notification.data as AppliedRequest}
          ></AppliedPostModal>
        );
      case BuddyNotificationType.DELETED_POST_YOU_APPLIED_FOR:
        return null;
      case BuddyNotificationType.GENERIC_MESSAGE:
        //TODO: fill in this modal for generic message
        return (
          <IonModal>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{notification.title}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <p>{notification.data as string}</p>
            </IonContent>
          </IonModal>
        );
      default:
        return null;
    }
  }

  /**
   * Returns the title and message that this notification list item should have.
   */
  function getTitleAndMessage(): { title: string; message: string } {
    switch (notification.type) {
      case BuddyNotificationType.APPLIED_TO_YOUR_POST:
        return {
          title: `${notification.otherUser!.name} applied to your post!`,
          message: `${
            notification.otherUser!.name
          } applied to your study session at ${locationEnumToStr(
            (notification.data as CreatedRequest).post.location
          )}, ${convertDateToDateStr(
            (notification.data as CreatedRequest).post.startDateTime
          )} from ${convertDateRangeToTimeRangeStr(
            (notification.data as CreatedRequest).post.startDateTime,
            (notification.data as CreatedRequest).post.endDateTime
          )}
`,
        };
      case BuddyNotificationType.CANCELLED_THEIR_APPLICATION:
        return {
          title: `${notification.otherUser!.name} cancelled!`,
          message: `${
            notification.otherUser!.name
          } cancelled their application to your study session at ${locationEnumToStr(
            (notification.data as CreatedRequest).post.location
          )}, ${convertDateToDateStr(
            (notification.data as CreatedRequest).post.startDateTime
          )} from ${convertDateRangeToTimeRangeStr(
            (notification.data as CreatedRequest).post.startDateTime,
            (notification.data as CreatedRequest).post.endDateTime
          )}
`,
        };
      case BuddyNotificationType.ACCEPTED_YOUR_APPLICATION:
        return {
          title: `${notification.otherUser!.name} accepted!`,
          message: `${
            notification.otherUser!.name
          } accepted your application to join their study session at ${locationEnumToStr(
            (notification.data as AppliedRequest).post.location
          )}, ${convertDateToDateStr(
            (notification.data as AppliedRequest).post.startDateTime
          )} from ${convertDateRangeToTimeRangeStr(
            (notification.data as AppliedRequest).post.startDateTime,
            (notification.data as AppliedRequest).post.endDateTime
          )}`,
        };
      case BuddyNotificationType.DELETED_POST_YOU_APPLIED_FOR:
        return {
          title: 'Study session cancelled',
          message: `${
            notification.otherUser!.name
          } cancelled study session at ${locationEnumToStr(
            (notification.data as Post).location
          )}, ${convertDateToDateStr(
            (notification.data as Post).startDateTime
          )} from ${convertDateRangeToTimeRangeStr(
            (notification.data as Post).startDateTime,
            (notification.data as Post).endDateTime
          )}`,
        };
      case BuddyNotificationType.GENERIC_MESSAGE:
        return {
          title: notification.title!,
          message: notification.data as string,
        };
      default:
        return { title: 'ERROR, should not reach this point', message: '' };
    }
  }

  return (
    <IonItem button onClick={clickHandler} detail={false}>
      <div slot="start" className={styles['notification-bubble-container']}>
        {!notification.hasBeenViewed && (
          <img src="assets/icons/orange-circle.svg"></img>
        )}
      </div>
      <IonLabel className="ion-text-wrap">
        <h2>{getTitleAndMessage().title}</h2>
        <p>{getTitleAndMessage().message}</p>
      </IonLabel>
      {getModalComponent()}
    </IonItem>
  );
}
