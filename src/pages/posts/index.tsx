import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';
import { Faculty, Gender, Post, Location } from '../../api/types';
import PostListItem from '../../components/PostListItem';

const sampleData: Post[] = [
  {
    id: '0',
    poster: {
      id: '0',
      name: 'Ben',
      gender: Gender.MALE,
      faculty: Faculty.COMPUTING,
      telegramHandle: 'murph99',
      year: 3,
      profilePhoto: '',
      thumbnailPhoto: '',
    },
    startDateTime: new Date(),
    endDateTime: new Date(),
    personCapacity: 5,
    participants: [],
    location: Location.SOC,
    description: 'HEllo, feel free to meet',
  },
];

export default function PostsPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="ion-padding-start" slot="start">
            <h1>Study Sessions</h1>
            <p>
              Posts don't suit your schedule?{' '}
              <span>
                <u>Make a post</u>
              </span>
            </p>
          </div>
          <IonButton slot="end" fill="clear" color="dark">
            <IonIcon icon={funnelOutline} slot="start"></IonIcon>
            <p>Filter</p>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {sampleData.map((data) => (
            <PostListItem post={data}></PostListItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
