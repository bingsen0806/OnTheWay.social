import { AppliedRequest } from '../../../../api/types';
import study from '../../../../assets/study3.json';
import Lottie from 'lottie-react';
import styles from './styles.module.scss';
import AppliedPostContent from '../../../AppliedPostModal/AppliedPostContent';

interface SelectedAppliedRequestProps {
  appliedRequest: AppliedRequest | null;
}

function SelectedAppliedRequest({
  appliedRequest,
}: SelectedAppliedRequestProps) {
  if (appliedRequest === null) {
    return (
      <div className="ion-margin-top">
        <p className="ion-text-center ion-no-margin ion-no-padding">
          No session selected
        </p>
        <Lottie
          animationData={study}
          loop={true}
          className={styles['centered']}
        />
      </div>
    );
  }
  return <AppliedPostContent appliedRequest={appliedRequest} />;
}

export default SelectedAppliedRequest;
