import {
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getNewPageOfAppliedRequests,
  getNewPageOfCreatedRequests,
} from '../../redux/slices/homeSlice';
import { getSelf } from '../../redux/slices/userSlice';
import AppliedRequestListItem from './components/RequesListItems/AppliedRequestListItem';
import CreatedRequestListItem from './components/RequesListItems/CreatedRequestListItem';

enum HomeTab {
  APPLIED_POST = 'Applied Posts',
  CREATED_POST = 'Created Posts',
}

export default function Homepage() {
  const username = useAppSelector((state) => state.user.user.name);
  const dispatch = useAppDispatch();
  const appliedPosts = useAppSelector((state) => state.home.appliedRequests);
  const createdPosts = useAppSelector((state) => state.home.createdRequests);
  const isLoading = useAppSelector((state) => state.home.isLoading);
  const [tabToShow, setTabToShow] = useState<HomeTab>(HomeTab.APPLIED_POST);

  useIonViewWillEnter(() => {
    void dispatch(getNewPageOfAppliedRequests());
    void dispatch(getNewPageOfCreatedRequests());
    void dispatch(getSelf());
    // TODO: add error hadnling
  });

  function getNextPageOfAppliedRequests() {
    void dispatch(getNewPageOfAppliedRequests());
    // TODO: add error handling
  }

  function getNextPageOfCreatedRequests() {
    void dispatch(getNewPageOfCreatedRequests());
    // TODO: add error handling
  }

  function renderListBasedOnTab() {
    if (tabToShow === HomeTab.CREATED_POST) {
      return (
        <IonList>
          {createdPosts.map((post) => (
            <CreatedRequestListItem
              key={post.post.id}
              createdRequest={post}
            ></CreatedRequestListItem>
          ))}
          <IonInfiniteScroll
            onIonInfinite={getNextPageOfCreatedRequests}
            threshold="50px"
            disabled={createdPosts.length < 20}
          >
            <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonList>
      );
    } else {
      return (
        <IonList>
          {appliedPosts.map((post) => (
            <AppliedRequestListItem key={post.post.id} appliedRequest={post} />
          ))}
          <IonInfiniteScroll
            onIonInfinite={getNextPageOfAppliedRequests}
            threshold="50px"
            disabled={appliedPosts.length < 20}
          >
            <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonList>
      );
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <h1 className="ion-padding-start">Hi {username}!</h1>
          <p className="ion-padding-start">
            Here are all the posts you've applied to or created
          </p>
        </IonToolbar>

        <IonToolbar>
          <IonSegment
            value={tabToShow}
            onIonChange={(e) => {
              setTabToShow(e.detail.value! as HomeTab);
            }}
          >
            <IonSegmentButton value={HomeTab.APPLIED_POST}>
              <IonLabel>{HomeTab.APPLIED_POST}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={HomeTab.CREATED_POST}>
              <IonLabel>{HomeTab.CREATED_POST}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {renderListBasedOnTab()}
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonContent>
    </IonPage>
  );
}
