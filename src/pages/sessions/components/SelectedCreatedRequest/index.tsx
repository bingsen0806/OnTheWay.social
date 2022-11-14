import { CreatedRequest } from '../../../../api/types';
import study from '../../../../assets/study2.json';
import Lottie from 'lottie-react';
import CreatedPostInformation from '../../../CreatedPostModal/CreatedPostInformation';
import styles from './styles.module.scss';

interface SelectedCreatedRequestProps {
  createdRequest: CreatedRequest | null;
}

function SelectedCreatedRequest({
  createdRequest,
}: SelectedCreatedRequestProps) {
  if (createdRequest === null) {
    return (
      <div>
        <Lottie
          animationData={study}
          loop={true}
          className={styles['centered']}
        />
        <p className="ion-text-center ion-no-margin ion-no-padding">
          No session selected
        </p>
      </div>
    );
  }
  return <CreatedPostInformation createdRequest={createdRequest} />;
}

export default SelectedCreatedRequest;
