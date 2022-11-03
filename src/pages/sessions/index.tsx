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
import { CREATE_POST, HOME } from '../../routes';
import { useHistory } from 'react-router';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthState } from '../../util/authentication';
import SelectedCreatedRequest from './components/SelectedCreatedRequest';
import { CreatedRequest } from '../../api/types';

enum HomeTab {
  APPLIED_POST = 'Applied',
  CREATED_POST = 'Created',
}

export default function Sessions() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const appliedPosts = useAppSelector((state) => state.home.appliedRequests);
  const createdPosts = useAppSelector((state) => state.home.createdRequests);
  const isLoading = useAppSelector((state) => state.home.isLoading);
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [tabToShow, setTabToShow] = useState<HomeTab>(HomeTab.CREATED_POST);
  const isMobile = getPlatforms().includes('mobile');
  const { isAuthenticated } = useAuthState();
  const [selectedRequest, setSelectedRequest] = useState<CreatedRequest | null>(
    null
  );

  const setRequestOnClick = (request: CreatedRequest) =>
    setSelectedRequest(request);

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
        <IonContent>
          <LoadingSpinner />
        </IonContent>
      );
    }
    if (tabToShow === HomeTab.CREATED_POST) {
      if (createdPosts.length === 0) {
        return (
          <IonContent fullscreen>
            <IonRefresher slot="fixed" onIonRefresh={refreshCreatedRequests}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <NoData>
              <div>
                <p>You have not created any posts</p>
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
          <IonRefresher slot="fixed" onIonRefresh={refreshCreatedRequests}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonGrid className="ion-margin-top ion-no-padding">
            <IonRow className="ion-justify-content-center ion-no-padding">
              <IonCol size="12" sizeMd="6">
                {createdPosts.map((post) => (
                  <CreatedRequestListItem
                    key={post.post.id}
                    createdRequest={post}
                    onClick={setRequestOnClick}
                    selected={selectedRequest?.post.id === post.post.id}
                  ></CreatedRequestListItem>
                ))}
              </IonCol>
              {!isMobile && (
                <IonCol sizeMd="6">
                  <SelectedCreatedRequest createdRequest={selectedRequest} />
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
        </IonContent>
      );
    } else {
      if (appliedPosts.length === 0) {
        return (
          <IonContent fullscreen>
            <IonRefresher slot="fixed" onIonRefresh={refreshCreatedRequests}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <NoData>
              <div>
                <p>You have not applied for any study posts</p>
                <IonButton
                  onClick={() => {
                    history.push(HOME);
                  }}
                  expand="block"
                >
                  Find a study buddy
                </IonButton>
              </div>
            </NoData>
          </IonContent>
        );
      }
      return (
        <IonContent fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={refreshAppliedRequests}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonGrid className="ion-margin-top ion-no-padding">
            <IonRow className="ion-justify-content-center ion-no-padding">
              <IonCol size="12" sizeMd="6" sizeLg="4">
                {appliedPosts.map((post) => (
                  <AppliedRequestListItem
                    key={post.post.id}
                    appliedRequest={post}
                  />
                ))}
              </IonCol>
            </IonRow>
          </IonGrid>
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
