import {
  IonContent,
  IonHeader,
  IonLabel,
  IonButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  RefresherEventDetail,
  IonGrid,
  IonRow,
  IonCol,
  getPlatforms,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getInitialData,
  getNewPageOfAppliedRequests,
  getNewPageOfCreatedRequests,
} from '../../redux/slices/homeSlice';
import { getInitialSelf } from '../../redux/slices/userSlice';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import usePageInitialLoad from '../../util/hooks/usePageInitialLoad';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import NoData from '../NoData';
import AppliedRequestListItem from './components/RequesListItems/AppliedRequestListItem';
import CreatedRequestListItem from './components/RequesListItems/CreatedRequestListItem';
import { BROWSE, CREATE_POST } from '../../routes';
import { useHistory } from 'react-router';
import { useAuthState } from '../../util/authentication';
import SelectedCreatedRequest from './components/SelectedCreatedRequest';
import { AppliedRequest, CreatedRequest } from '../../api/types';
import SelectedAppliedRequest from './components/SelectedAppliedRequest';
import FullScreenLoadingSpinner from '../../components/FullScreenLoadingSpinner';
import styles from './styles.module.scss';

enum HomeTab {
  APPLIED_POST = 'Applied',
  CREATED_POST = 'Created',
}

export default function Sessions() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');
  const history = useHistory();
  const dispatch = useAppDispatch();
  const appliedPosts = useAppSelector((state) => state.home.appliedRequests);
  const createdPosts = useAppSelector((state) => state.home.createdRequests);
  const isLoading = useAppSelector((state) => state.home.isLoading);
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [tabToShow, setTabToShow] = useState<HomeTab>(
    page ? HomeTab.APPLIED_POST : HomeTab.CREATED_POST
  );
  const isMobile = getPlatforms().includes('mobile');
  const { isAuthenticated } = useAuthState();
  const [selectedRequest, setSelectedRequest] = useState<CreatedRequest | null>(
    null
  );
  const [selectedAppliedRequest, setSelectedAppliedRequest] =
    useState<AppliedRequest | null>(null);

  const setRequestOnClick = (request: CreatedRequest) =>
    setSelectedRequest(request);

  if (selectedRequest !== null) {
    //do a check if post is still in list of posts
    const listFiltered = createdPosts.filter(
      (req) => req.post.id === selectedRequest.post.id
    );
    if (listFiltered.length === 0) {
      setSelectedRequest(null);
    }
  }

  if (selectedAppliedRequest !== null) {
    //do a check if post is still in list of posts
    const listFiltered = appliedPosts.filter(
      (req) => req.post.id === selectedAppliedRequest.post.id
    );
    if (listFiltered.length === 0) {
      setSelectedAppliedRequest(null);
    }
  }

  usePageInitialLoad(() => {
    if (isAuthenticated) {
      dispatch(getInitialSelf())
        .unwrap()
        .then((selfResp) => {
          if (!selfResp.success) {
            handleCheckedError(selfResp.message as string);
            return;
          }
          dispatch(getInitialData())
            .unwrap()
            .then((resp) => {
              if (!resp.success) {
                handleCheckedError(selfResp.message as string);
                return;
              }
            })
            .catch((error) => {
              handleUnknownError(error);
            });
        })
        .catch((error) => {
          handleUnknownError(error);
        });
    }
  });

  function refreshAppliedRequests(event: CustomEvent<RefresherEventDetail>) {
    dispatch(getNewPageOfAppliedRequests())
      .unwrap()
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message as string);
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        event.detail.complete();
      });
  }

  function refreshCreatedRequests(event: CustomEvent<RefresherEventDetail>) {
    dispatch(getNewPageOfCreatedRequests())
      .unwrap()
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message as string);
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      })
      .finally(() => {
        event.detail.complete();
      });
  }

  function renderListBasedOnTab() {
    if (isLoading) {
      return (
        <IonContent fullscreen>
          <FullScreenLoadingSpinner />
        </IonContent>
      );
    }
    if (tabToShow === HomeTab.CREATED_POST) {
      if (createdPosts.length === 0) {
        return (
          <IonContent fullscreen>
            {isMobile && (
              <IonRefresher slot="fixed" onIonRefresh={refreshCreatedRequests}>
                <IonRefresherContent></IonRefresherContent>
              </IonRefresher>
            )}
            <NoData>
              <div>
                <p className="ion-text-center">
                  You have not created any posts
                </p>
                <IonButton
                  onClick={() => {
                    history.push(CREATE_POST);
                  }}
                  expand="block"
                >
                  Create a study session
                </IonButton>
              </div>
            </NoData>
          </IonContent>
        );
      }
      return (
        <IonContent fullscreen>
          {isMobile && (
            <IonRefresher slot="fixed" onIonRefresh={refreshCreatedRequests}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
          )}
          {isMobile ? (
            <IonList>
              {createdPosts.map((post) => (
                <CreatedRequestListItem
                  key={post.post.id}
                  createdRequest={post}
                  onClick={setRequestOnClick}
                  selected={selectedRequest?.post.id === post.post.id}
                ></CreatedRequestListItem>
              ))}
            </IonList>
          ) : (
            <IonGrid className={`ion-no-padding ${styles['desktop-grid']}`}>
              <IonRow
                className={`ion-justify-content-center ion-no-padding ${styles['desktop-row']}`}
              >
                <IonCol size={isMobile ? '12' : '5'}>
                  (
                  <IonContent>
                    <IonList>
                      {createdPosts.map((post) => (
                        <CreatedRequestListItem
                          key={post.post.id}
                          createdRequest={post}
                          onClick={setRequestOnClick}
                          selected={selectedRequest?.post.id === post.post.id}
                        ></CreatedRequestListItem>
                      ))}
                    </IonList>
                  </IonContent>
                  )
                </IonCol>
                {!isMobile && (
                  <IonCol size="7">
                    <IonContent>
                      <SelectedCreatedRequest
                        createdRequest={selectedRequest}
                      />
                    </IonContent>
                  </IonCol>
                )}
              </IonRow>
            </IonGrid>
          )}
          {isMobile && (
            <IonInfiniteScroll
              threshold="100px"
              onIonInfinite={(ev) => {
                void ev.target.complete();
              }}
            >
              <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          )}
        </IonContent>
      );
    } else {
      if (appliedPosts.length === 0) {
        return (
          <IonContent fullscreen>
            {isMobile && (
              <IonRefresher slot="fixed" onIonRefresh={refreshCreatedRequests}>
                <IonRefresherContent></IonRefresherContent>
              </IonRefresher>
            )}
            <NoData>
              <div>
                <p className="ion-text-center">
                  You have not applied for any study session
                </p>
                <IonButton
                  onClick={() => {
                    history.push(BROWSE);
                  }}
                  expand="block"
                >
                  Find a session
                </IonButton>
              </div>
            </NoData>
          </IonContent>
        );
      }
      return (
        <IonContent fullscreen>
          {isMobile && (
            <IonRefresher slot="fixed" onIonRefresh={refreshAppliedRequests}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
          )}
          {isMobile ? (
            <IonList>
              {appliedPosts.map((post) => (
                <AppliedRequestListItem
                  onClick={setSelectedAppliedRequest}
                  selected={selectedAppliedRequest?.post.id === post.post.id}
                  key={post.post.id}
                  appliedRequest={post}
                />
              ))}
            </IonList>
          ) : (
            <IonGrid className={`ion-no-padding ${styles['desktop-grid']}`}>
              <IonRow
                className={`ion-justify-content-center ion-no-padding ${styles['desktop-row']}`}
              >
                <IonCol size={isMobile ? '12' : '5'}>
                  <IonContent>
                    <IonList>
                      {appliedPosts.map((post) => (
                        <AppliedRequestListItem
                          onClick={setSelectedAppliedRequest}
                          selected={
                            selectedAppliedRequest?.post.id === post.post.id
                          }
                          key={post.post.id}
                          appliedRequest={post}
                        />
                      ))}
                    </IonList>
                  </IonContent>
                </IonCol>
                {!isMobile && (
                  <IonCol sizeLg="7">
                    <IonContent>
                      <SelectedAppliedRequest
                        appliedRequest={selectedAppliedRequest}
                      />
                    </IonContent>
                  </IonCol>
                )}
              </IonRow>
            </IonGrid>
          )}
          {isMobile && (
            <IonInfiniteScroll
              threshold="100px"
              onIonInfinite={(ev) => {
                void ev.target.complete();
              }}
            >
              <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          )}
        </IonContent>
      );
    }
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-margin">
        {isMobile && (
          <IonToolbar>
            <h1 className="ion-padding-start">Your sessions</h1>
          </IonToolbar>
        )}
        <IonToolbar>
          <IonSegment
            value={tabToShow}
            onIonChange={(e) => {
              setTabToShow(e.detail.value! as HomeTab);
            }}
          >
            <IonSegmentButton value={HomeTab.CREATED_POST}>
              <IonLabel>{HomeTab.CREATED_POST}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={HomeTab.APPLIED_POST}>
              <IonLabel>{HomeTab.APPLIED_POST}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      {renderListBasedOnTab()}
    </IonPage>
  );
}
