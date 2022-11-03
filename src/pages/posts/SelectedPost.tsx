import React from 'react';
import { Post } from '../../api/types';
import study from '../../assets/study.json';
import Lottie from 'lottie-react';


import PostDetails from '../../components/PostDetails';
import { useAuthState } from '../../util/authentication';
import OtherStudyBuddies from '../../components/OtherStudyBuddies';
import AboutPoster from '../../components/AboutPoster';

interface SelectedPostProps {
  post: Post | null;
}

function SelectedPost({ post }: SelectedPostProps) {
  const { isAuthenticated } = useAuthState();
  if (post === null) {
    return (
      <div>
        <Lottie animationData={study} loop={true} />
      </div>
    );
  }
  return (
    <div>
      <PostDetails post={post} />
      {isAuthenticated && (
        <OtherStudyBuddies studyBuddies={post.participants} />
      )}
      {isAuthenticated && <AboutPoster poster={post.poster} />}
      <p> {post.description}</p>
    </div>
  );
}

export default SelectedPost;
