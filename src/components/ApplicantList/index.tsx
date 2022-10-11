import { IonCol, IonGrid, IonList, IonRow } from '@ionic/react';
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
    <IonGrid>
      <IonRow
        className={
          styles['header'] + ' ion-justify-content-start ion-padding-start'
        }
      >
        <IonCol>Applicants</IonCol>
      </IonRow>
      {applicants.length <= 0 ? (
        <IonRow className="ion-justify-content-start ion-padding-start">
          <IonCol>
            <p>No one has applied to your post yet. Check again later!</p>
          </IonCol>
        </IonRow>
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
    </IonGrid>
  );
}
