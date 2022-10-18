import {
  IonButton,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from '@ionic/react';
import { funnelOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Location, locationEnumToStr } from '../../api/types';
import LoadingSpinner from '../../components/LoadingSpinner';
import PostListItem from '../../components/PostListItem';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getInitialPostsData,
  getNewPageOfPostsWithFilter,
  getNextPageOfPosts,
} from '../../redux/slices/postsSlice';
import { CREATE_POST, LOGIN } from '../../routes';
import { useAuthState } from '../../util/authentication';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import usePageInitialLoad from '../../util/hooks/usePageInitialLoad';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import NoData from '../NoData';
import styles from './styles.module.scss';

export default function PostsPage() {
  const history = useHistory();
  const listOfPosts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const { isAuthenticated } = useAuthState();

  const routeToLogin = () => {
    if (!isAuthenticated) {
      history.replace(LOGIN);
    }
  };

  const [filterLocations, setFilterLocations] = useState<{
    [key in Location]: boolean;
  }>({
    [Location.CLB]: false,
    [Location.UTOWN]: false,
    [Location.SCIENCE]: false,
    [Location.FASS]: false,
    [Location.ENGINEERING]: false,
    [Location.BIZ]: false,
    [Location.SDE]: false,
    [Location.SOC]: false,
    [Location.LAW]: false,
  });

  function resetFilter() {
    const newFilterLocations = {} as { [key in Location]: boolean };
    for (const location in filterLocations) {
      newFilterLocations[location as unknown as Location] = false;
    }
    setFilterLocations(newFilterLocations);
    resetPostsList();
  }

  function getColorOfLocationFilterBasedOnClickStatus(location: Location) {
    return filterLocations[location] ? 'primary' : 'dark';
  }

  function resetPostsList() {
    dispatch(getNewPageOfPostsWithFilter({ locations: [] }))
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

  function setFilterLocationValue(location: Location) {
    const prvState = filterLocations[location];
    setFilterLocations({ ...filterLocations, [location]: !prvState });
  }

  function applyNewFilter() {
    const newLocationFilter: Location[] = [];
    for (const location in filterLocations) {
      if (filterLocations[location as unknown as Location]) {
        newLocationFilter.push(Number(location) as unknown as Location);
      }
    }
    dispatch(getNewPageOfPostsWithFilter({ locations: newLocationFilter }))
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

  function requestNextPageOfPosts() {
    dispatch(getNextPageOfPosts())
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

  // fetch the data right before this scren is opened
  usePageInitialLoad(() => {
    dispatch(getInitialPostsData())
      .unwrap()
      .then((resp) => {
        if (!resp.success) {
          handleCheckedError(resp.message as string);
        }
      })
      .catch((error) => {
        handleUnknownError(error);
      });
  });

  function refreshContents(event: CustomEvent<RefresherEventDetail>) {
    const newLocationFilter: Location[] = [];
    for (const location in filterLocations) {
      if (filterLocations[location as unknown as Location]) {
        newLocationFilter.push(Number(location) as unknown as Location);
      }
    }
    dispatch(getNewPageOfPostsWithFilter({ locations: newLocationFilter }))
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

  return (
    <>
      <IonMenu contentId="main-content" side="end">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Filter Posts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <h4 className={styles['filter-category-header']}>Locations</h4>
          {Object.values(Location)
            .filter((v) => !isNaN(Number(v)))
            .map((locationEnum) => (
              <IonChip
                key={locationEnum}
                color={getColorOfLocationFilterBasedOnClickStatus(
                  locationEnum as Location
                )}
                onClick={() => setFilterLocationValue(locationEnum as Location)}
              >
                {locationEnumToStr(locationEnum as Location)}
              </IonChip>
            ))}
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonMenuToggle>
                    <IonButton
                      color="medium"
                      fill="outline"
                      expand="block"
                      onClick={resetFilter}
                    >
                      Reset
                    </IonButton>
                  </IonMenuToggle>
                </IonCol>
                <IonCol>
                  <IonMenuToggle>
                    <IonButton
                      color="primary"
                      expand="block"
                      onClick={applyNewFilter}
                    >
                      Apply
                    </IonButton>
                  </IonMenuToggle>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonFooter>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <div className="ion-padding-start ion-padding-bottom" slot="start">
              <h1>Study Sessions</h1>
              <IonButton
                href={CREATE_POST}
                size="small"
                expand="block"
                slot="start"
              >
                Create Study Session
              </IonButton>
            </div>
            {!isAuthenticated && (
              <IonButton slot="end" onClick={routeToLogin}>
                Login
              </IonButton>
            )}
            <IonMenuToggle slot="end">
              <IonButton fill="clear" color="dark">
                <IonIcon icon={funnelOutline} slot="start"></IonIcon>
                <p>Filter</p>
              </IonButton>
            </IonMenuToggle>
          </IonToolbar>
        </IonHeader>
        <IonContent
          fullscreen
          className={
            listOfPosts.length === 0 ? '' : styles['posts-list-container']
          }
        >
          {isLoading && <LoadingSpinner />}
          {!isLoading && (
            <>
              <IonRefresher slot="fixed" onIonRefresh={refreshContents}>
                <IonRefresherContent></IonRefresherContent>
              </IonRefresher>
              <IonButton
                fill="clear"
                color="dark"
                className={styles['display-mobile']}
              >
                <IonIcon icon={funnelOutline} slot="start"></IonIcon>
                <p>Filter</p>
              </IonButton>
              {listOfPosts.length === 0 ? (
                <NoData>
                  <div>
                    <p>No study sessions!</p>
                    <IonButton
                      onClick={() => {
                        history.replace(CREATE_POST);
                      }}
                      expand="block"
                    >
                      Create a study session
                    </IonButton>
                  </div>
                </NoData>
              ) : (
                <IonList className={styles['posts-list']} lines="none">
                  {listOfPosts.map((data) => (
                    <PostListItem post={data} key={data.id}></PostListItem>
                  ))}
                </IonList>
              )}

              <IonInfiniteScroll
                onIonInfinite={requestNextPageOfPosts}
                threshold="50px"
                disabled={listOfPosts.length < 20}
              >
                <IonInfiniteScrollContent loadingSpinner="circles"></IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
}
