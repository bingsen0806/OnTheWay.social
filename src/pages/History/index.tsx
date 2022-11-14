import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonList,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import FullScreenLoadingSpinner from '../../components/FullScreenLoadingSpinner';
import PostListItem from '../../components/PostListItem';
import StudyBuddy from '../../components/StudyBuddy';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserHistory } from '../../redux/slices/historySlice';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import usePageInitialLoad from '../../util/hooks/usePageInitialLoad';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';

export default function HistoryPage() {
  const userHistory = useAppSelector((state) => state.history.history);
  const wasLoadedOnce = useAppSelector((state) => state.history.wasLoadedOnce);
  const isLoading = useAppSelector((state) => state.history.isLoading);
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();

  console.log(wasLoadedOnce);

  usePageInitialLoad(() => {
    if (!wasLoadedOnce) {
      dispatch(getUserHistory())
        .unwrap()
        .then((resp) => {
          if (!resp.success) {
            handleCheckedError(resp.message as string);
          }
        })
        .catch((error) => {
          handleUnknownError(error);
        });
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <h1 className="ion-padding-start ion-no-margin">About Art</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isLoading ? (
          <FullScreenLoadingSpinner />
        ) : (
          <IonGrid fixed>
            <IonRow>
              <IonCol>
                <h1>Since joining BuddyNUS, you have...</h1>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" sizeLg="6">
                Created {userHistory.totalCreatedStudySessions} study sessions
              </IonCol>
              <IonCol size="12" sizeLg="6">
                Applied for {userHistory.totalAppliedStudySessons} study
                sessions
              </IonCol>
              <IonCol size="12" sizeLg="6">
                Met {userHistory.numPeopleMet} different people
              </IonCol>
              <IonCol size="12" sizeLg="6">
                Spent {userHistory.totalStudyHours} hours studying
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <h1>Study Buddies you met recently</h1>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonList>
                  {userHistory.recentBuddies &&
                  userHistory.recentBuddies.length > 0
                    ? userHistory.recentBuddies.map((buddy) => (
                        <StudyBuddy buddy={buddy}></StudyBuddy>
                      ))
                    : 'You have not studied with anyone yet!'}
                </IonList>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <h1>Recent Study Sessions</h1>
                <p>Here are the last 5 study sessions you had.</p>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonList>
                  {userHistory.recentStudySessions &&
                  userHistory.recentStudySessions.length > 0
                    ? userHistory.recentStudySessions.map((post) => (
                        <PostListItem
                          post={post}
                          selected={false}
                          onClick={() => {
                            return;
                          }}
                        />
                      ))
                    : "You haven't had any study sessions!"}
                </IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
}
