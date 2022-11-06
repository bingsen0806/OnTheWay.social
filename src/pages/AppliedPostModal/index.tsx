import { IonContent, IonModal } from '@ionic/react';
import { AppliedRequest } from '../../api/types';
import styles from './styles.module.scss';
import AppliedPostContent from './AppliedPostContent';

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
  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={() => {
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
