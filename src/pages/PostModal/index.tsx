import {
  IonModal,
  useIonAlert,
} from '@ionic/react';
import { Post } from '../../api/types';
import {
  createAppliedRequest,
  deleteAppliedRequest,
} from '../../api/appliedRequests';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { removePost } from '../../redux/slices/postsSlice';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../firebase';
import { reloadInitialData } from '../../redux/slices/homeSlice';
import useInfoToast from '../../util/hooks/useInfoToast';
import styles from './styles.module.scss';
import { ErrorType } from '../../api/errors';
import useErrorToast from '../../util/hooks/useErrorToast';
import { useAuthState } from '../../util/authentication';
import { useHistory } from 'react-router';
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
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const [presentAlert] = useIonAlert();
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const presentInfoToast = useInfoToast();
  const presentErrorToast = useErrorToast();
  const { isAuthenticated } = useAuthState();
  const history = useHistory();

  function handleApply(postId: string) {
    setIsLoading(true);
    createAppliedRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          switch (resp.message) {
            case ErrorType.USER_PROFILE_NOT_CREATED:
              onClose(() => handleCheckedError(resp.message));
              return;
            case ErrorType.POST_ALREADY_APPLIED:
              presentInfoToast('You have applied for this post.');
              setIsApplied(true);
              void dispatch(reloadInitialData());
              return;
            case ErrorType.POST_NOT_FOUND:
              presentErrorToast(
                'Unable to apply to post. It may have been deleted.'
              );
              onCloseAction();
              return;
            default:
              handleCheckedError(resp.message);
          }
        } else {
          logEvent(analytics, 'apply_post');
          setIsApplied(true);
          presentInfoToast('Successfully applied!');
          void dispatch(reloadInitialData());
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function sendCancellationRequest(postId: string) {
    setIsLoading(true);
    deleteAppliedRequest(postId)
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message);
        } else {
          setIsApplied(false);
          presentInfoToast('Study application cancelled');
          logEvent(analytics, 'cancel_post_application');
          void dispatch(reloadInitialData());
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function onCloseAction() {
    onClose(() => {
      if (isApplied) {
        dispatch(removePost(applyPost));
      }
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
