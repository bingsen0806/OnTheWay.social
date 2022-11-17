import {
  getPlatforms,
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import { useLayoutEffect } from 'react';
import FullScreenLoadingSpinner from '../../components/FullScreenLoadingSpinner';
import DesktopNavbar from '../../components/Navbar/DesktopNavbar';
import Footer from '../../components/Navbar/Footer';
import PostListItem from '../../components/PostListItem';
import StudyBuddy from '../../components/StudyBuddy';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserHistory } from '../../redux/slices/historySlice';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';

export default function HistoryPage() {
  const userHistory = useAppSelector((state) => state.history.history);
  const wasLoadedOnce = useAppSelector((state) => state.history.wasLoadedOnce);
  const isLoading = useAppSelector((state) => state.history.isLoading);
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const dispatch = useAppDispatch();
  const isMobile = getPlatforms().includes('mobile');

  useLayoutEffect(() => {
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
  }, [wasLoadedOnce]);

  return (
    <IonPage>
      {!isMobile && <DesktopNavbar />}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <h1 className="ion-padding-start ion-no-margin">Your History</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isLoading ? (
          <FullScreenLoadingSpinner />
        ) : (
          <IonGrid fixed className="ion-padding">
            <IonRow>
              <IonCol>
                <h2 className="ion-no-margin">
                  Since joining BuddyNUS, you have...
                </h2>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12" sizeLg="3">
                Created <b>{userHistory.totalCreatedStudySessions}</b> study
                sessions
              </IonCol>
              <IonCol size="12" sizeLg="3">
                Applied for <b>{userHistory.totalAppliedStudySessons}</b> study
                sessions
              </IonCol>
              <IonCol size="12" sizeLg="3">
                Met <b>{userHistory.numPeopleMet}</b> different people
              </IonCol>
              <IonCol size="12" sizeLg="3">
                Spent <b>{Math.floor(userHistory.totalStudyHours)}</b> hours
                studying
              </IonCol>
            </IonRow>
            {userHistory.recentBuddies && userHistory.recentBuddies.length > 0 && (
              <>
                <IonRow>
                  <IonCol>
                    <h2>Study Buddies you met recently</h2>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="ion-no-padding">
                    <IonList className="ion-no-padding">
                      {userHistory.recentBuddies.map((buddy) => (
                        <StudyBuddy key={buddy.id} buddy={buddy}></StudyBuddy>
                      ))}
                    </IonList>
                  </IonCol>
                </IonRow>
              </>
            )}

            {userHistory.recentStudySessions &&
              userHistory.recentStudySessions.length > 0 && (
                <>
                  <IonRow>
                    <IonCol>
                      <h2>Recent Study Sessions</h2>
                      <p className="ion-no-margin">
                        {userHistory.recentStudySessions.length === 1
                          ? 'Here is the last study session you had.'
                          : `Here are the last ${userHistory.recentStudySessions.length} study sessions
                        you had.`}
                      </p>
                    </IonCol>
                  </IonRow>
                  <IonList className="ion-no-padding">
                    {userHistory.recentStudySessions.map((post) => (
                      <PostListItem
                        key={post.id}
                        infoOnly
                        post={post}
                        selected={false}
                        onClick={() => {
                          return;
                        }}
                      />
                    ))}
                    <IonItem lines="none"></IonItem>
                  </IonList>
                </>
              )}
          </IonGrid>
        )}
      </IonContent>
      {!isMobile && <Footer />}
    </IonPage>
  );
}
