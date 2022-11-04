import { IonModal } from '@ionic/react';
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
  function onCloseAction() {
    onClose(() => {
      return;
    });
  }

  return (
    <IonModal
      isOpen={isOpen}
      onWillDismiss={onCloseAction}
      className={styles['modal-container']}
    >
      <PostInformation onClose={onClose} applyPost={applyPost} />
    </IonModal>
  );
}
