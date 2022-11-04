import {
  getPlatforms,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRow,
} from '@ionic/react';
import { calendarClearOutline, timeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { locationEnumToStr, CreatedRequest } from '../../../../../api/types';
import LocationImage from '../../../../../components/LocationImage';
import {
  convertDateToDateStr,
  convertDateRangeToTimeRangeStr,
} from '../../../../../util/dateUtils';
import CreatedPostModal from '../../../../CreatedPostModal';
import styles from '../styles.module.scss';

interface CreatedRequestListItemProps {
  createdRequest: CreatedRequest;
  selected: boolean;
  onClick: (request: CreatedRequest) => void;
}

export default function CreatedRequestListItem({
  createdRequest,
  selected,
  onClick,
}: CreatedRequestListItemProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  function closeModal(callback: () => void) {
    setIsModalOpen(false);
    setTimeout(callback, 200);
  }
  const isMobile = getPlatforms().includes('mobile');

  return (
    <IonItem
      button
      onClick={() => {
        setIsModalOpen(true);
        onClick(createdRequest);
      }}
      detail={false}
      color={selected && !isMobile ? 'tertiary' : ''}
    >
      <IonGrid>
        <IonRow className={styles['post-container']}>
          <IonCol size="4" sizeLg="5">
            <LocationImage
              location={createdRequest.post.location}
            ></LocationImage>
          </IonCol>
          <IonCol size="1"></IonCol>
          <IonCol size="6" className="ion-no-margin">
            <div>
              <p className={styles['post-text-location']}>
                {locationEnumToStr(createdRequest.post.location)}
              </p>
              <p className={styles['key-details-text']}>
                <IonIcon icon={calendarClearOutline} />{' '}
                {convertDateToDateStr(createdRequest.post.startDateTime)}
              </p>
              <p className={styles['key-details-text']}>
                <IonIcon icon={timeOutline} />{' '}
                {convertDateRangeToTimeRangeStr(
                  createdRequest.post.startDateTime,
                  createdRequest.post.endDateTime
                )}
              </p>
              {createdRequest.applicants.length > 0 && (
                <p className={styles['applicant-number-not-zero-text']}>
                  {createdRequest.applicants.length} pending applicant(s)
                </p>
              )}
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
      {isMobile && (
        <CreatedPostModal
          isOpen={isModalOpen}
          onClose={closeModal}
          createdRequest={createdRequest}
        />
      )}
    </IonItem>
  );
}
