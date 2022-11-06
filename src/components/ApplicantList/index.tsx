import { IonList } from '@ionic/react';
import { User } from '../../api/types';
import SingleApplicant from '../SingleApplicant';
import styles from './styles.module.scss';

interface ApplicantListProps {
  applicants: User[];
  addParticipantToCreatedRequest: (participant: User) => void;
  postId: string;
}

export default function ApplicantList({
  applicants,
  postId,
  addParticipantToCreatedRequest,
}: ApplicantListProps) {
  return (
    <>
      <p className={styles['header']}>Applicants</p>
      {applicants.length === 0 ? (
        <p>No one has applied to your post yet. Check again later!</p>
      ) : (
        <IonList>
          {applicants.map((applicant) => (
            <SingleApplicant
              postId={postId}
              applicant={applicant}
              key={applicant.id}
              addParticipantToCreatedRequest={addParticipantToCreatedRequest}
            ></SingleApplicant>
          ))}
        </IonList>
      )}
    </>
  );
}
