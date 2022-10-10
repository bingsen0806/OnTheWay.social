import { IonCol, IonGrid, IonList, IonRow } from '@ionic/react';
import { User } from '../../api/types';
import StudyBuddy from '../StudyBuddy';
import styles from './styles.module.scss';

interface OtherStudyBuddiesProp {
  studyBuddies: User[];
}

export default function OtherStudyBuddies({
  studyBuddies,
}: OtherStudyBuddiesProp) {
  return studyBuddies && studyBuddies.length > 0 ? (
    <IonGrid className="ion-margin-vertical">
      <IonRow
        className={
          styles['header'] +
          ' ion-justify-content-start ion-padding-start ion-padding-bottom'
        }
      >
        <IonCol>Confirmed Attendees</IonCol>
        {/*TODO: implement popup */}
      </IonRow>
      {studyBuddies.length <= 0 ? (
        <IonRow className="ion-justify-content-start ion-padding-start">
          <IonCol>
            <p>
              No one is participating in this study session yet. Be the first!
            </p>
          </IonCol>
        </IonRow>
      ) : (
        <IonList>
          {studyBuddies.map((buddy) => (
            <StudyBuddy buddy={buddy} key={buddy.id}></StudyBuddy>
          ))}
        </IonList>
      )}
    </IonGrid>
  ) : (
    <></>
  );
}
