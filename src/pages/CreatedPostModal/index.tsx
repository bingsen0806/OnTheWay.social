import { IonContent, IonModal } from '@ionic/react';
import { CreatedRequest } from '../../api/types';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import {
  reloadInitialData,
  replaceCreatedRequest,
} from '../../redux/slices/homeSlice';
import styles from './styles.module.scss';
import { replaceNotification } from '../../redux/slices/notificationsSlice';
import CreatedPostInformation from './CreatedPostInformation';
import { useHistory, useLocation } from 'react-router';

interface PosterViewRequestProps {
  isOpen: boolean;
  onClose: (callback: () => void) => void;
  createdRequest: CreatedRequest;
}

export default function CreatedPostModal({
  isOpen,
  onClose,
  createdRequest,
}: PosterViewRequestProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    setCreatedRequestState(createdRequest);
  }, [createdRequest]);
  // temp state of created request, any changes will be synced up with redux when the modal is closed
  const [createdRequestState, setCreatedRequestState] =
    useState<CreatedRequest>(
      JSON.parse(JSON.stringify(createdRequest)) as CreatedRequest
    );
  // simple flag to determine if we should request reload of post data if cretaed request is changed
  const [createdRequestWasEdited, setCreatedRequestWasEdited] =
    useState<boolean>(false);
  const history = useHistory();
  const location = useLocation();
  function closeModal() {
    if (location.search.includes('modal=true')) {
      history.goBack();
    }
    onClose(() => {
      if (createdRequestWasEdited) {
        dispatch(replaceNotification(createdRequestState));
        dispatch(replaceCreatedRequest(createdRequestState));
        void dispatch(reloadInitialData());
      }
    });
  }

  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={closeModal}
      className={styles['modal-container']}
    >
      <IonContent fullscreen>
        <CreatedPostInformation
          onClose={onClose}
          createdRequest={createdRequest}
        />
      </IonContent>
    </IonModal>
  );
}
