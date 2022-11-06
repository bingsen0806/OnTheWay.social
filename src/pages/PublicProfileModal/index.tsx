import { IonContent, IonModal } from '@ionic/react';
import { User } from '../../api/types';
import styles from './styles.module.scss';
import PublicProfileContents from './PublicProfileContents';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function PublicProfileModal({
  isOpen,
  onClose,
  user,
}: PublicProfileModalProps) {
  function closeModal() {
    onClose();
  }
  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={closeModal}
      className={styles['modal-container']}
    >
      <IonContent fullscreen>
        <PublicProfileContents user={user} onClose={onClose} />
      </IonContent>
    </IonModal>
  );
}
