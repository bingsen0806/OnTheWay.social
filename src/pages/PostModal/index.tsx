import { IonContent, IonModal } from '@ionic/react';
import { Post } from '../../api/types';
import styles from './styles.module.scss';
import PostInformation from './PostInformation';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: ((callback: () => void) => void) | (() => void);
  applyPost: Post;
}

// export const mockCreatedRequest: CreatedRequest = {
//   post: mockPost,
//   applicants: [mockUser2, mockUser3],
// };

export default function PostModal({
  isOpen,
  onClose,
  applyPost,
}: ApplyModalProps) {
  return (
    <IonModal isOpen={isOpen} className={styles['modal-container']}>
      <IonContent fullscreen>
        <PostInformation onClose={onClose} applyPost={applyPost} />
      </IonContent>
    </IonModal>
  );
}
