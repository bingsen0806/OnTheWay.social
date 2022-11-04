import {
  getPlatforms,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow,
} from '@ionic/react';
import { calendarClearOutline, timeOutline } from 'ionicons/icons';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import {
  AppliedRequest,
  locationEnumToStr,
  AppliedRequestStatus,
} from '../../../../../api/types';
import LocationImage from '../../../../../components/LocationImage';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import AppliedPostModal from '../../../../AppliedPostModal';
import styles from '../styles.module.scss';

interface AppliedRequestListItemProps {
  appliedRequest: AppliedRequest;
  selected: boolean;
  onClick: (request: AppliedRequest) => void;
}

export default function AppliedRequestListItem({
  appliedRequest,
  selected,
  onClick,
}: AppliedRequestListItemProps) {
  const [isModalOpen, setIsModalOpen] =
    useStateWithCallbackLazy<boolean>(false);
  const isMobile = getPlatforms().includes('mobile');
  function closeModal(callback: () => void) {
    setIsModalOpen(false, callback);
  }

  return (
    <IonItem
      button
      onClick={() => {
        setIsModalOpen(true, () => {
          return;
        });
        onClick(appliedRequest);
      }}
      color={selected ? 'tertiary' : ''}
      detail={false}
      className={styles['item-container']}
    >
      <hr
        className={
          appliedRequest.status === AppliedRequestStatus.ACCEPTED
            ? styles['success-line']
            : styles['alert-line']
        }
      />
      <IonGrid>
        <IonRow className={`${styles['post-container']}`}>
          <IonCol size="4" sizeLg="5">
            <LocationImage
              location={appliedRequest.post.location}
            ></LocationImage>
          </IonCol>
          <IonCol size="1"></IonCol>
          <IonCol size="6">
            <p className={styles['post-text-location']}>
              {locationEnumToStr(appliedRequest.post.location)}
            </p>
            <p className={styles['key-details-text']}>
              <IonIcon icon={calendarClearOutline} />{' '}
              {convertDateToDateStr(appliedRequest.post.startDateTime)}
            </p>
            <p className={styles['key-details-text']}>
              <IonIcon icon={timeOutline} />{' '}
              {convertDateRangeToTimeRangeStr(
                appliedRequest.post.startDateTime,
                appliedRequest.post.endDateTime
              )}
            </p>
          </IonCol>
        </IonRow>
      </IonGrid>

      {isMobile && (
        <AppliedPostModal
          isOpen={isModalOpen}
          onClose={closeModal}
          appliedRequest={appliedRequest}
        />
      )}
    </IonItem>
  );
}
