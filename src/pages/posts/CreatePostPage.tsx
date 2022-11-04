import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import moment from 'moment';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { createPost } from '../../api/posts';
import { locationEnumToStr, Post } from '../../api/types';
import { Location } from '../../api/types';
import ButtonSpinner from '../../components/ButtonSpinner';
import DateTimePicker from '../../components/DateTimePicker';
import DropdownSelection, {
  DropdownItem,
} from '../../components/DropdownSelection';
import TextInputField from '../../components/TextInputField/TextInputField';
import { analytics } from '../../firebase';
import { useAppDispatch } from '../../redux/hooks';
import { reloadInitialData } from '../../redux/slices/homeSlice';
import { SESSIONS } from '../../routes';
import { roundToNext15mins } from '../../util/dateUtils';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useInfoToast from '../../util/hooks/useInfoToast';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import styles from './styles.module.scss';

const MAX_DESCRIPTION_LENGTH = 200;

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
  const [date, setDate] = useState<string>(moment().toISOString(true));
  const [startTime, setStartTime] = useState<string>(
    roundToNext15mins(moment()).toISOString(true)
  );
  const [endTime, setEndTime] = useState<string>(
    moment
      .min([
        roundToNext15mins(moment()).add(2, 'hours'),
        moment().set('hour', 23).set('minute', 45),
      ])
      .toISOString(true)
  );

  const history = useHistory();

  const [errorMessages, setErrorMessages] = useState<InputErrorMessages>({
    date: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  function checkStartTimeBeforeEndTime() {
    return startTime < endTime;
  }

  function areAllFieldsSelected() {
    if (
      post.location === undefined ||
      date === undefined ||
      startTime === undefined ||
      endTime === undefined
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
    if (!date) {
      newErrorMessages.date = 'Please select a date for your study session';
      haveError = true;
    }
    if (!startTime) {
      newErrorMessages.startTime =
        'Please select the time that your study session starts at';
      haveError = true;
    }
    if (!endTime) {
      newErrorMessages.endTime =
        'Please select the time that your study session ends at';
      haveError = true;
    } else if (!checkStartTimeBeforeEndTime()) {
      newErrorMessages.endTime = 'End time must be later than start time';
      haveError = true;
    }
    const start = combineDateAndTime(date, startTime);
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
      startDateTime: combineDateAndTime(date, startTime),
      endDateTime: combineDateAndTime(date, endTime),
      description: post.description ? post.description : '',
    };

    setPost(newPost);
    setIsLoading(true);
    createPost(newPost)
      .then((resp) => {
        if (!resp.success) {
          setIsLoading(false);
          handleCheckedError(resp.message as string);
        } else {
          setPost({ description: '' } as Post);
          presentInfoToast('Successfully created new post!');
          setIsLoading(false);
          void dispatch(reloadInitialData()).then(() => {
            history.push(SESSIONS);
          });
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
          <h1 className="ion-padding-start ion-no-margin">
            Create a study session
          </h1>
        </IonToolbar>
        <IonToolbar>
          <div>
            <p className="ion-no-margin ion-no-padding">
              You will be notified via email when others apply for your session.
            </p>
            <p className="ion-no-margin ion-no-padding">
              Your telegram handle will only be shared with applicants after you
              accept them.
            </p>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className={styles['content-container']}>
        <IonGrid fixed className="ion-padding">
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="8" sizeLg="6">
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
            <IonCol sizeMd="8" sizeLg="6">
              <DateTimePicker
                value={date}
                type="date"
                label="Date"
                onChange={(date) => {
                  setDate(date);
                }}
                errorMessage={errorMessages.date}
              ></DateTimePicker>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="4" sizeLg="3">
              <DateTimePicker
                value={startTime}
                type="time"
                label="Start"
                onChange={(startTime) => {
                  setStartTime(startTime);
                  setEndTime(
                    moment
                      .min([
                        moment(startTime).add(2, 'hours'),
                        moment(startTime).set('hour', 23).set('minute', 45),
                      ])
                      .toISOString(true)
                  );
                }}
                errorMessage={errorMessages.startTime}
              ></DateTimePicker>
            </IonCol>
            <IonCol sizeMd="4" sizeLg="3">
              <DateTimePicker
                value={endTime}
                type="time"
                label="End"
                onChange={(endTime) => {
                  setEndTime(endTime);
                }}
                errorMessage={errorMessages.endTime}
              ></DateTimePicker>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="8" sizeLg="6">
              <TextInputField
                multiline
                label="Description"
                placeholder={
                  'More details you would like others to know - like where you are or what you are studying!'
                }
                value={post.description}
                errorMessage={errorMessages.description}
                onChange={(description) => {
                  setPost({ ...post, description });
                }}
                maxlength={MAX_DESCRIPTION_LENGTH}
              />
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="5" sizeLg="4">
              <IonButton expand="block" onClick={submitCreatePost}>
                {isLoading ? <ButtonSpinner /> : 'Post'}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
