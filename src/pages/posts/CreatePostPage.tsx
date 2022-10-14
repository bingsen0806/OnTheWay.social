import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonLoading,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import moment from 'moment';
import { useState } from 'react';
import { createPost } from '../../api/posts';
import { locationEnumToStr, Post } from '../../api/types';
import { Location } from '../../api/types';
import DateTimePicker from '../../components/DateTimePicker';
import DropdownSelection, {
  DropdownItem,
} from '../../components/DropdownSelection';
import TextInputField from '../../components/TextInputField/TextInputField';
import { analytics } from '../../firebase';
import { useAppDispatch } from '../../redux/hooks';
import { reloadInitialData } from '../../redux/slices/homeSlice';
import { reloadInitialPostsData } from '../../redux/slices/postsSlice';
import { POSTS } from '../../routes';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useInfoToast from '../../util/hooks/useInfoToast';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import styles from './styles.module.scss';

const locationDropdownItems: DropdownItem<Location>[] = [
  {
    label: locationEnumToStr(Location.CLB),
    value: Location.CLB,
  },
  {
    label: locationEnumToStr(Location.UTOWN),
    value: Location.UTOWN,
  },
  {
    label: locationEnumToStr(Location.SCIENCE),
    value: Location.SCIENCE,
  },
  {
    label: locationEnumToStr(Location.FASS),
    value: Location.FASS,
  },
  {
    label: locationEnumToStr(Location.ENGINEERING),
    value: Location.ENGINEERING,
  },
  {
    label: locationEnumToStr(Location.BIZ),
    value: Location.BIZ,
  },
  {
    label: locationEnumToStr(Location.SDE),
    value: Location.SDE,
  },
  {
    label: locationEnumToStr(Location.SOC),
    value: Location.SOC,
  },
  {
    label: locationEnumToStr(Location.LAW),
    value: Location.LAW,
  },
];

/**
 * Combines a date string and time string to form a new string with both elements.
 */
function combineDateAndTime(date: string, time: string) {
  const combined = date.split('T')[0] + ' ' + time.split('T')[1];
  const split = combined.split('Z');
  const returnValue = split.length > 1 ? `${split[0]}+08:00` : split[0];
  return returnValue;
}

interface InputErrorMessages {
  date: string;
  startTime: string;
  endTime: string;
  description: string;
}

export default function CreatePostPage() {
  const dispatch = useAppDispatch();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const presentInfoToast = useInfoToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldShowDropdownErrors, setShouldShowDropdownErrors] =
    useState<boolean>(false);
  const [post, setPost] = useState<Post>({ description: '' } as Post);
  const [dateTimes, setDateTimes] = useState({
    date: new Date().toISOString(),
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
  });

  const [errorMessages, setErrorMessages] = useState<InputErrorMessages>({
    date: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  function checkStartTimeBeforeEndTime() {
    return dateTimes.startTime < dateTimes.endTime;
  }

  function areAllFieldsSelected() {
    if (
      post.location === undefined ||
      dateTimes.date === undefined ||
      dateTimes.startTime === undefined ||
      dateTimes.endTime === undefined
    ) {
      return false;
    }
    return true;
  }

  function submitCreatePost() {
    let haveError = false;
    if (!areAllFieldsSelected()) {
      setShouldShowDropdownErrors(true);
      haveError = true;
    }
    const newErrorMessages = {} as InputErrorMessages;
    if (!dateTimes.date) {
      newErrorMessages.date = 'Please select a date for your study session';
      haveError = true;
    }
    if (!dateTimes.startTime) {
      newErrorMessages.startTime =
        'Please select the time that your study session starts at';
      haveError = true;
    }
    if (!dateTimes.endTime) {
      newErrorMessages.endTime =
        'Please select the time that your study session ends at';
      haveError = true;
    } else if (!checkStartTimeBeforeEndTime()) {
      newErrorMessages.endTime = 'End time must be later than start time';
      haveError = true;
    }
    const start = combineDateAndTime(dateTimes.date, dateTimes.startTime);
    const startIsInPast = moment(start).isBefore(new Date(), 'minute');
    if (startIsInPast) {
      newErrorMessages.startTime = 'Start time cannot be in the past';
      haveError = true;
    }
    if (post.description.length > 200) {
      newErrorMessages.description = 'Description cannot exceed 200 characters';
      haveError = true;
    }

    if (haveError) {
      setErrorMessages(newErrorMessages);
      return;
    }
    setErrorMessages({ date: '', startTime: '', endTime: '', description: '' });

    const newPost = {
      ...post,
      startDateTime: combineDateAndTime(dateTimes.date, dateTimes.startTime),
      endDateTime: combineDateAndTime(dateTimes.date, dateTimes.endTime),
      description: post.description ? post.description : '',
    };

    setPost(newPost);
    setIsLoading(true);
    createPost(newPost)
      .then((resp) => {
        setIsLoading(false);
        if (!resp.success) {
          handleCheckedError(resp.message as string);
        } else {
          setPost({ description: '' } as Post);
          setIsLoading(false);
          presentInfoToast('Successfully created new post!');
          void dispatch(reloadInitialData());
          void dispatch(reloadInitialPostsData());
          logEvent(analytics, 'create_post');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        handleUnknownError(error);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={POSTS}></IonBackButton>
          </IonButtons>
          <h1 className="ion-padding-start ion-no-margin">Make a Post</h1>
        </IonToolbar>
        <IonToolbar>
          <div className="ion-padding-start">
            <p>
              Fill in the details of your post. You will be notified when others
              apply to your post.
            </p>
            <p>
              Your telegram handle will only be shared with users whom you
              accept applications to your post.
            </p>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid fixed className="ion-padding">
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <DropdownSelection<Location>
                placeholder="Location"
                dropdownItems={locationDropdownItems}
                onChange={(location) => {
                  setPost({ ...post, location });
                }}
                shouldShowError={shouldShowDropdownErrors}
              ></DropdownSelection>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <DateTimePicker
                value={dateTimes.date}
                type="date"
                label="Date"
                onChange={(date) => {
                  setDateTimes({ ...dateTimes, date });
                }}
                errorMessage={errorMessages.date}
              ></DateTimePicker>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <DateTimePicker
                value={dateTimes.startTime}
                type="time"
                label="Start Time"
                onChange={(startTime) => {
                  setDateTimes({ ...dateTimes, startTime });
                }}
                errorMessage={errorMessages.startTime}
              ></DateTimePicker>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <DateTimePicker
                value={dateTimes.endTime}
                type="time"
                label="End Time"
                onChange={(endTime) => {
                  setDateTimes({ ...dateTimes, endTime });
                }}
                errorMessage={errorMessages.endTime}
              ></DateTimePicker>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <TextInputField
                multiline
                label="Description"
                placeholder="More details you would like others to know - like where you are or what you are studying!"
                value={post.description}
                errorMessage={errorMessages.description}
                onChange={(description) => {
                  setPost({ ...post, description });
                }}
              />
              <span
                className={
                  post.description !== undefined &&
                  post.description.length > 200
                    ? styles['error-text']
                    : styles['normal-text']
                }
              >
                {post.description.length} / 200
              </span>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <IonButton expand="block" onClick={submitCreatePost}>
                Post
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonLoading isOpen={isLoading}></IonLoading>
      </IonContent>
    </IonPage>
  );
}
