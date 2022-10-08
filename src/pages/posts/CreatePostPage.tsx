import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { createPost } from '../../api/posts';
import { locationEnumToStr, Post } from '../../api/types';
import { Location } from '../../api/types';
import DateTimePicker from '../../components/DateTimePicker';
import DropdownSelection, {
  DropdownItem,
} from '../../components/DropdownSelection';
import TextInputField from '../../components/TextInputField/TextInputField';
import { POSTS } from '../../routes';

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
  return date.split('T')[0] + 'T' + time.split('T')[1];
}

interface InputErrorMessages {
  date: string;
  startTime: string;
  endTime: string;
  personCapacity: string;
  description: string;
}

export default function CreatePostPage() {
  const [shouldShowDropdownErrors, setShouldShowDropdownErrors] =
    useState<boolean>(false);
  const [post, setPost] = useState<Post>({} as Post);

  const [dateTimes, setDateTimes] = useState({
    date: new Date().toISOString(),
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
  });

  const [errorMessages, setErrorMessages] = useState<InputErrorMessages>({
    date: '',
    startTime: '',
    endTime: '',
    personCapacity: '',
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
      dateTimes.endTime === undefined ||
      post.personCapacity === undefined ||
      post.description
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
    if (!post.personCapacity) {
      newErrorMessages.personCapacity =
        'Please specify how many people you would like to have at this study session';
      haveError = true;
    }

    if (haveError) {
      setErrorMessages(newErrorMessages);
      return;
    }

    const newPost = {
      ...post,
      startDateTime: combineDateAndTime(dateTimes.date, dateTimes.startTime),
      endDateTime: combineDateAndTime(dateTimes.date, dateTimes.startTime),
      description: post.description ? post.description : '',
    };

    console.log(newPost);

    setPost(newPost);
    void createPost(newPost);
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
                  console.log(startTime);
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
                  console.log(endTime);
                  setDateTimes({ ...dateTimes, endTime });
                }}
                errorMessage={errorMessages.endTime}
              ></DateTimePicker>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <TextInputField
                label="Number of people"
                placeholder="Number of people"
                value={
                  post.personCapacity
                    ? post.personCapacity.toString()
                    : undefined
                }
                errorMessage={errorMessages.personCapacity}
                onChange={(personCapacity) => {
                  setPost({ ...post, personCapacity: Number(personCapacity) });
                }}
              />
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
      </IonContent>
    </IonPage>
  );
}