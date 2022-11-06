import {
  getPlatforms,
  IonButton,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
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
import {
  DayOfTheWeek,
  dayOfTheWeekEnumToStr,
  Location,
  locationEnumToStr,
  TimeOfDay,
  timeOfDayEnumToStr,
} from '../../api/types';
import { useAppDispatch } from '../../redux/hooks';
import {
  getNewPageOfPostsWithFilter,
} from '../../redux/slices/postsSlice';
import { CREATE_POST, LOGIN } from '../../routes';
import { useAuthState } from '../../util/authentication';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import PostsPageBody from './PostsPageBody';
import styles from './styles.module.scss';

export default function PostsPage() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const { isAuthenticated } = useAuthState();
  const isMobile = getPlatforms().includes('mobile');

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

  const [filterDays, setFilterDays] = useState<{
    [key in DayOfTheWeek]: boolean;
  }>({
    [DayOfTheWeek.MONDAY]: false,
    [DayOfTheWeek.TUESDAY]: false,
    [DayOfTheWeek.WEDNESDAY]: false,
    [DayOfTheWeek.THURSDAY]: false,
    [DayOfTheWeek.FRIDAY]: false,
    [DayOfTheWeek.SATURDAY]: false,
    [DayOfTheWeek.SUNDAY]: false,
  });

  const [filterTimes, setFilterTimes] = useState<{
    [key in TimeOfDay]: boolean;
  }>({
    [TimeOfDay.MORNING]: false,
    [TimeOfDay.AFTERNOON]: false,
    [TimeOfDay.EVENING]: false,
    [TimeOfDay.NIGHT]: false,
  });

  function resetFilter() {
    const newFilterLocations = {} as { [key in Location]: boolean };
    const newFilterDays = {} as { [key in DayOfTheWeek]: boolean };
    const newFilterTimes = {} as { [key in TimeOfDay]: boolean };

    for (const location in filterLocations) {
      newFilterLocations[location as unknown as Location] = false;
    }
    for (const filterDay in filterDays) {
      newFilterDays[filterDay as unknown as DayOfTheWeek] = false;
    }
    for (const filterTime in filterTimes) {
      newFilterTimes[filterTime as unknown as TimeOfDay] = false;
    }
    setFilterLocations(newFilterLocations);
    setFilterDays(newFilterDays);
    setFilterTimes(newFilterTimes);
    resetPostsList();
  }

  function getColorOfLocationFilterBasedOnClickStatus(location: Location) {
    return filterLocations[location] ? 'primary' : 'dark';
  }

  function getColorOfDayFilterBasedOnClickStatus(day: DayOfTheWeek) {
    return filterDays[day] ? 'primary' : 'dark';
  }

  function getColorOfTimeFilterBasedOnClickStatus(time: TimeOfDay) {
    return filterTimes[time] ? 'primary' : 'dark';
  }

  function resetPostsList() {
    dispatch(
      getNewPageOfPostsWithFilter({ locations: [], timesOfDay: [], days: [] })
    )
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
  function setFilterDayValue(day: DayOfTheWeek) {
    const prvState = filterDays[day];
    setFilterDays({ ...filterDays, [day]: !prvState });
  }
  function setFilterTimeValue(time: TimeOfDay) {
    const prvState = filterTimes[time];
    setFilterTimes({ ...filterTimes, [time]: !prvState });
  }

  function applyNewFilter() {
    const newLocationFilter: Location[] = [];
    for (const location in filterLocations) {
      if (filterLocations[location as unknown as Location]) {
        newLocationFilter.push(Number(location) as unknown as Location);
      }
    }
    const newFilterDays: DayOfTheWeek[] = [];
    for (const filterDay in filterDays) {
      if (filterDays[filterDay as unknown as DayOfTheWeek]) {
        newFilterDays.push(Number(filterDay) as unknown as DayOfTheWeek);
      }
    }
    const newFilterTimes: TimeOfDay[] = [];
    for (const filterTime in filterTimes) {
      if (filterTimes[filterTime as unknown as TimeOfDay]) {
        newFilterTimes.push(Number(filterTime) as unknown as TimeOfDay);
      }
    }

    dispatch(
      getNewPageOfPostsWithFilter({
        locations: newLocationFilter,
        timesOfDay: newFilterTimes,
        days: newFilterDays,
      })
    )
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

  function refreshContents(event: CustomEvent<RefresherEventDetail>) {
    const newLocationFilter: Location[] = [];
    for (const location in filterLocations) {
      if (filterLocations[location as unknown as Location]) {
        newLocationFilter.push(Number(location) as unknown as Location);
      }
    }
    const newFilterDays: DayOfTheWeek[] = [];
    for (const filterDay in filterDays) {
      if (filterDays[filterDay as unknown as DayOfTheWeek]) {
        newFilterDays.push(Number(filterDay) as unknown as DayOfTheWeek);
      }
    }
    const newFilterTimes: TimeOfDay[] = [];
    for (const filterTime in filterTimes) {
      if (filterTimes[filterTime as unknown as TimeOfDay]) {
        newFilterTimes.push(Number(filterTime) as unknown as TimeOfDay);
      }
    }
    dispatch(
      getNewPageOfPostsWithFilter({
        locations: newLocationFilter,
        timesOfDay: newFilterTimes,
        days: newFilterDays,
      })
    )
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
          <h4 className={styles['filter-category-header']}>Days</h4>
          {Object.values(DayOfTheWeek)
            .filter((v) => !isNaN(Number(v)))
            .map((dayOfTheWeek) => (
              <IonChip
                key={dayOfTheWeek}
                color={getColorOfDayFilterBasedOnClickStatus(
                  dayOfTheWeek as DayOfTheWeek
                )}
                onClick={() => setFilterDayValue(dayOfTheWeek as DayOfTheWeek)}
              >
                {dayOfTheWeekEnumToStr(dayOfTheWeek as DayOfTheWeek)}
              </IonChip>
            ))}
          <h4 className={styles['filter-category-header']}>Start Time</h4>
          {Object.values(TimeOfDay)
            .filter((v) => !isNaN(Number(v)))
            .map((time) => (
              <IonChip
                key={time}
                color={getColorOfTimeFilterBasedOnClickStatus(
                  time as TimeOfDay
                )}
                onClick={() => setFilterTimeValue(time as TimeOfDay)}
              >
                {timeOfDayEnumToStr(time as TimeOfDay)}
              </IonChip>
            ))}
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
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <div className={styles['header']}>
          <IonHeader>
            <IonToolbar>
              <div>
                <h1>Study Sessions</h1>
                {isMobile && isAuthenticated && (
                  <IonButton
                    onClick={() => {
                      history.replace(CREATE_POST);
                    }}
                    size="small"
                    slot="start"
                    className="ion-margin-bottom"
                  >
                    Create Study Session
                  </IonButton>
                )}
                {isMobile && !isAuthenticated && (
                  <IonButton
                    onClick={() => {
                      history.replace(LOGIN);
                    }}
                    size="small"
                    slot="start"
                    className="ion-margin-bottom"
                  >
                    Login
                  </IonButton>
                )}
              </div>
              <IonMenuToggle slot="end">
                <IonButton fill="clear" color="dark">
                  <IonIcon icon={funnelOutline} slot="start"></IonIcon>
                  <p>Filter</p>
                </IonButton>
              </IonMenuToggle>
            </IonToolbar>
          </IonHeader>
        </div>
        {isMobile ? (
          <IonContent fullscreen>
            <IonRefresher slot="fixed" onIonRefresh={refreshContents}>
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <PostsPageBody />
          </IonContent>
        ) : (
          <IonContent fullscreen>
            <PostsPageBody />
          </IonContent>
        )}
      </IonPage>
    </>
  );
}
