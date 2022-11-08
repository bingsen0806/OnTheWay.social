import { IonContent, IonModal } from '@ionic/react';
import { User } from '../../api/types';
import styles from './styles.module.scss';
import PublicProfileContents from './PublicProfileContents';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

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
  const location = useLocation();
  function closeModal() {
    onClose();
  }
  useEffect(() => {
    if (!location.search.includes('modal=true') && isOpen) {
      onClose();
    }
  }, [location]);

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
