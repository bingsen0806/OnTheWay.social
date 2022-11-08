import { IonContent, IonModal } from '@ionic/react';
import { AppliedRequest } from '../../api/types';
import styles from './styles.module.scss';
import AppliedPostContent from './AppliedPostContent';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface AppliedPostModalProps {
  isOpen: boolean;
  onClose: (callback: () => void) => void;
  appliedRequest: AppliedRequest;
}

export default function AppliedPostModal({
  isOpen,
  onClose,
  appliedRequest,
}: AppliedPostModalProps) {
  const location = useLocation();
  useEffect(() => {
    if (!location.search.includes('modal=true')) {
      onClose(() => {
        return;
      });
    }
  }, [location]);
  const history = useHistory();

  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={() => {
        if (location.search.includes('modal=true')) {
          history.goBack();
        }
        onClose(() => {
          return;
        });
      }}
      className={styles['modal-container']}
    >
      <IonContent fullscreen>
        <AppliedPostContent onClose={onClose} appliedRequest={appliedRequest} />
      </IonContent>
    </IonModal>
  );
}
