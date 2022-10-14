import { IonCol, IonGrid, IonList, IonRow } from '@ionic/react';
import { User } from '../../api/types';
import StudyBuddy from '../StudyBuddy';
import styles from './styles.module.scss';

interface OtherStudyBuddiesProp {
  studyBuddies: User[];
  inCreatedRequest?: boolean;
}

export default function OtherStudyBuddies({
  studyBuddies,
  inCreatedRequest,
}: OtherStudyBuddiesProp) {
  return (
    <IonGrid className="ion-margin-vertical">
      <IonRow className="ion-justify-content-start ion-padding-start">
        <IonCol className={styles['header']} size="12">
          Confirmed Attendees
        </IonCol>
        {inCreatedRequest && studyBuddies.length === 0 && (
          <p>No one is participating in this study session yet.</p>
        )}
        {!inCreatedRequest && studyBuddies.length === 0 && (
          <IonCol>
            <p>
              No one is participating in this study session yet. Be the first!
            </p>
          </IonCol>
        )}
      </IonRow>
      {studyBuddies.length > 0 && (
        <IonList>
          {studyBuddies.map((buddy) => (
            <StudyBuddy
              buddy={buddy}
              key={buddy.id}
              inCreatedRequest={inCreatedRequest}
            ></StudyBuddy>
          ))}
        </IonList>
      )}
    </IonGrid>
  );
}
