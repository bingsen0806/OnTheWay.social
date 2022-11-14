import React from 'react';
import { Post } from '../../api/types';
import study from '../../assets/study.json';
import Lottie from 'lottie-react';
import styles from './styles.module.scss';
import PostInformation from '../PostModal/PostInformation';

interface SelectedPostProps {
  post: Post | null;
}

function SelectedPost({ post }: SelectedPostProps) {
  if (post === null) {
    return (
      <div className={styles['margin']}>
        <Lottie
          className={styles['animation']}
          animationData={study}
          loop={true}
        />
        <p className="ion-text-center ion-no-margin ion-no-padding">
          No session selected. Click on a session to find out more
        </p>
      </div>
    );
  }
  return <PostInformation applyPost={post} />;
}

export default SelectedPost;
