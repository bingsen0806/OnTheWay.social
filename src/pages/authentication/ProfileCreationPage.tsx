import {
  IonButton,
  IonCol,
  IonContent,
  IonPopover,
  IonRow,
} from '@ionic/react';
import { logEvent } from 'firebase/analytics';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { createUserProfile } from '../../api/authentication';
import { ErrorType } from '../../api/errors';
import { Faculty, Gender, User } from '../../api/types';
import ButtonSpinner from '../../components/ButtonSpinner';
import DropdownSelection, {
  DropdownItem,
} from '../../components/DropdownSelection';
import TextInputField from '../../components/TextInputField/TextInputField';
import { analytics } from '../../firebase';
import { HOME } from '../../routes';
import useCheckedErrorHandler from '../../util/hooks/useCheckedErrorHandler';
import useErrorToast from '../../util/hooks/useErrorToast';
import useInfoToast from '../../util/hooks/useInfoToast';
import useUnknownErrorHandler from '../../util/hooks/useUnknownErrorHandler';
import AuthenticationPageContainer from './AuthenticationPageContainer';
import styles from './styles.module.scss';

interface ProfileCreationErrorMessages {
  username: string;
  telegramHandle: string;
}

const genderDropdownItems: DropdownItem<Gender>[] = [
  {
    label: 'Male',
    value: Gender.MALE,
  },
  {
    label: 'Female',
    value: Gender.FEMALE,
  },
  {
    label: 'Prefer not to say',
    value: Gender.PREFER_NOT_TO_SAY,
  },
];

const facultyDropdownItems: DropdownItem<Faculty>[] = [
  {
    label: 'Arts & Social Sciences',
    value: Faculty.ARTS_AND_SOCIAL_SCIENCES,
  },
  {
    label: 'Business',
    value: Faculty.BUSINESS,
  },
  {
    label: 'Computing',
    value: Faculty.COMPUTING,
  },
  {
    label: 'Dentistry',
    value: Faculty.DENTISTRY,
  },
  {
    label: 'Design & Engineering',
    value: Faculty.DESIGN_AND_ENGINEERING,
  },
  {
    label: 'Law',
    value: Faculty.LAW,
  },
  {
    label: 'Medicine',
    value: Faculty.MEDICINE,
  },
  {
    label: 'Music',
    value: Faculty.MUSIC,
  },
  {
    label: 'Science',
    value: Faculty.SCIENCE,
  },
];

const yearOfStudyDropdownItems: DropdownItem<number>[] = [
  {
    label: 'Year 1',
    value: 1,
  },
  {
    label: 'Year 2',
    value: 2,
  },
  {
    label: 'Year 3',
    value: 3,
  },
  {
    label: 'Year 4',
    value: 4,
  },
];

/**
 * Profile creation page.
 * This page only shown after initial sign up success.
 * If user avoids this page somehow, before any action that requires a completed profile,
 * they will be redirected to this page.
 */
export default function ProfileCreationPage() {
  const history = useHistory();
  const presentInfoToast = useInfoToast();
  const presentErrorToast = useErrorToast();
  const handleCheckedError = useCheckedErrorHandler();
  const handleUnknownError = useUnknownErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<User>({
    id: '',
    name: '',
    gender: Gender.PREFER_NOT_TO_SAY,
    faculty: Faculty.ARTS_AND_SOCIAL_SCIENCES,
    telegramHandle: '',
    year: 2022,
    profilePhoto: '',
    thumbnailPhoto: '',
  });
  const [errorMessages, setErrorMessages] =
    useState<ProfileCreationErrorMessages>({
      username: '',
      telegramHandle: '',
    });
  const [shouldShowDropdownErrors, setShouldShowDropdownErrors] =
    useState<boolean>(false);

  function areAllFieldsSelected() {
    if (
      userDetails.faculty === undefined ||
      userDetails.gender === undefined ||
      userDetails.year === undefined
    ) {
      return false;
    }
    return true;
  }
  async function submit() {
    let haveError = false;

    const newErrorMessages: ProfileCreationErrorMessages = {
      username: '',
      telegramHandle: '',
    };
    if (!userDetails.name) {
      newErrorMessages.username = 'Please provide your username';
      haveError = true;
    }
    if (!userDetails.telegramHandle) {
      newErrorMessages.telegramHandle = 'Please provide your telegram handle';
      haveError = true;
    }

    setErrorMessages(newErrorMessages);

    if (!areAllFieldsSelected()) {
      setShouldShowDropdownErrors(true);
      haveError = true;
    }

    if (haveError) {
      return;
    }

    try {
      setIsLoading(true);
      const resp = await createUserProfile(userDetails);
      console.log(resp);
      if (resp.success) {
        history.replace(HOME);
        presentInfoToast(
          'User profile creation successful. Enjoy using BuddyNUS!'
        );
        logEvent(analytics, 'profile_create');
      } else {
        switch (resp.message) {
          case ErrorType.TELEGRAM_HANDLE_IN_USE:
            presentErrorToast(
              'Telegram handle is already registered to an account.'
            );
            return;
          case ErrorType.USERNAME_IN_USE:
            presentErrorToast('Username already registered.');
            return;
          case ErrorType.TELE_AND_USERNAME_IN_USE:
            presentErrorToast('Username and Telegram handle already in use.');
            return;
          default:
            handleCheckedError(resp.message);
        }
      }
    } catch (error) {
      handleUnknownError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthenticationPageContainer pageTitle="Complete your profile">
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="6">
          <TextInputField
            label="Username"
            placeholder="Username"
            value={userDetails.name}
            errorMessage={errorMessages.username}
            onChange={(name) => {
              setUserDetails({ ...userDetails, name });
            }}
          />
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="6" className={styles['input-field-col']}>
          <TextInputField
            label="Telegram Handle"
            placeholder="Telegram Handle"
            value={userDetails.telegramHandle}
            errorMessage={errorMessages.telegramHandle}
            onChange={(telegramHandle) => {
              setUserDetails({ ...userDetails, telegramHandle });
            }}
          />
          <p className={styles['popover-text']} id="telegram-popover">
            Why do we need this?
          </p>
          <IonPopover trigger="telegram-popover" triggerAction="click">
            <IonContent class="ion-padding">
              Telegram handles are shared between users when both users have a
              confirmed study session together, to allow for communication.
            </IonContent>
          </IonPopover>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="6">
          <DropdownSelection<Gender>
            placeholder="Gender"
            dropdownItems={genderDropdownItems}
            onChange={(gender) => {
              setUserDetails({ ...userDetails, gender });
            }}
            shouldShowError={shouldShowDropdownErrors}
          ></DropdownSelection>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="6">
          <DropdownSelection<Faculty>
            placeholder="Faculty"
            dropdownItems={facultyDropdownItems}
            onChange={(faculty) => {
              setUserDetails({ ...userDetails, faculty });
            }}
            shouldShowError={shouldShowDropdownErrors}
          ></DropdownSelection>
        </IonCol>
      </IonRow>
      <IonRow className="ion-justify-content-center">
        <IonCol size="10" sizeMd="6">
          <DropdownSelection<number>
            placeholder="Year of study"
            dropdownItems={yearOfStudyDropdownItems}
            onChange={(year) => {
              setUserDetails({ ...userDetails, year });
            }}
            shouldShowError={shouldShowDropdownErrors}
          ></DropdownSelection>
        </IonCol>
      </IonRow>
      <IonRow className="ion-margin-top ion-justify-content-center">
        <IonCol size="10" sizeMd="6" sizeLg="4">
          <IonButton
            onClick={() => {
              if (!isLoading) {
                void submit();
              }
            }}
            expand="block"
          >
            {isLoading ? <ButtonSpinner /> : 'Submit'}
          </IonButton>
        </IonCol>
      </IonRow>
    </AuthenticationPageContainer>
  );
}
