import {
  getPlatforms,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonPopover,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import moment from 'moment';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppliedRequest,
  BuddyNotification,
  BuddyNotificationType,
  CreatedRequest,
  locationEnumToStr,
  Post,
} from '../../../api/types';
import { useAppDispatch } from '../../../redux/hooks';
import { reloadInitialData } from '../../../redux/slices/homeSlice';
import { markNotification } from '../../../redux/slices/notificationsSlice';
import { reloadSelf } from '../../../redux/slices/userSlice';
import { ART, SESSIONS } from '../../../routes';
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
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isMobile = getPlatforms().includes('mobile');

  function closeModal() {
    setIsModalOpen(false);
  }

  function clickHandler() {
    if (notification.type === BuddyNotificationType.RECEIVED_NEW_ART) {
      void dispatch(reloadSelf());
      history.push(ART);
    }
    void dispatch(markNotification(notification.id));
    if (isMobile) {
      history.push({ search: '?modal=true' });
      setIsModalOpen(true);
    } else {
      if (notification.type === BuddyNotificationType.APPLIED_TO_YOUR_POST) {
        void dispatch(reloadInitialData());
        history.push(SESSIONS);
      } else if (
        notification.type === BuddyNotificationType.ACCEPTED_YOUR_APPLICATION
      ) {
        void dispatch(reloadInitialData());
        history.push({
          pathname: SESSIONS,
          search: `?page=1`,
        });
      }
    }
  }

  function getModalComponent() {
    switch (notification.type) {
      case BuddyNotificationType.APPLIED_TO_YOUR_POST:
      case BuddyNotificationType.CANCELLED_THEIR_APPLICATION:
        if (
          moment(
            (notification.data as CreatedRequest).post.endDateTime,
            true
          ).isBefore(moment())
        ) {
          return (
            <IonPopover
              isOpen={isModalOpen}
              onDidDismiss={() => {
                setIsModalOpen(false);
              }}
            >
              <IonContent class="ion-padding">
                <p>
                  The post associated with this application is already past and
                  no longer exists.
                </p>
              </IonContent>
            </IonPopover>
          );
        }
        return (
          <CreatedPostModal
            isOpen={isModalOpen}
            onClose={closeModal}
            createdRequest={notification.data as CreatedRequest}
          ></CreatedPostModal>
        );
      case BuddyNotificationType.ACCEPTED_YOUR_APPLICATION:
        if (
          moment(
            (notification.data as AppliedRequest).post.endDateTime,
            true
          ).isBefore(moment())
        ) {
          return (
            <IonPopover
              isOpen={isModalOpen}
              onDidDismiss={() => {
                setIsModalOpen(false);
              }}
            >
              <IonContent>
                <p className="ion-padding-horizontal">
                  The post associated with this application is already past and
                  no longer exists.
                </p>
              </IonContent>
            </IonPopover>
          );
        }

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
      case BuddyNotificationType.RECEIVED_NEW_ART:
        return {
          title: 'You have received a new art piece!',
          message: 'Go check it out!',
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
      {isMobile && getModalComponent()}
    </IonItem>
  );
}
