import React from 'react';
import { Post } from '../../api/types';
import study from '../../assets/study.json';
import Lottie from 'lottie-react';

import { useAuthState } from '../../util/authentication';
import PostInformation from '../PostModal/PostInformation';

interface SelectedPostProps {
  post: Post | null;
}

function SelectedPost({ post }: SelectedPostProps) {
  const { isAuthenticated } = useAuthState();
  if (post === null) {
    return (
      <div>
        <p className="ion-text-center ion-no-margin ion-no-padding">
          No session selected. Click on a session to find out more
        </p>
        <Lottie animationData={study} loop={true} />
      </div>
    );
  }
  return <PostInformation applyPost={post} />;
}

export default SelectedPost;
