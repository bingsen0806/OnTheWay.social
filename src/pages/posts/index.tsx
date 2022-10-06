import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonToolbar,
  useIonViewDidEnter,
} from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';
import { useState } from 'react';
import { PostsFilter } from '../../api/posts';
import PostListItem from '../../components/PostListItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getNewPageOfPostsWithFilter } from '../../redux/slices/postsSlice';

export default function PostsPage() {
  const listOfPosts = useAppSelector((state) => state.posts.posts);
  const dispatch = useAppDispatch();
  const [tempFilter, setTempFilter] = useState<PostsFilter>({
    locations: [],
  });
  // fetch the data right before this scren is opened
  useIonViewDidEnter(() => {
    void dispatch(getNewPageOfPostsWithFilter(tempFilter));
    //TODO: add error
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="ion-padding-start" slot="start">
            <h1>Study Sessions</h1>
            <p>
              Can't find a post that suits your schedule?{' '}
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
          {listOfPosts.map((data) => (
            <PostListItem post={data} key={data.id}></PostListItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
