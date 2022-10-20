import {
  ApiResponseBody,
  AppliedRequestStatus,
  BuddyNotification,
  BuddyNotificationType,
  Faculty,
  Gender,
  Location,
} from './types';

export function getNotifications(): Promise<
  ApiResponseBody<BuddyNotification[]>
> {
  return Promise.resolve({
    success: true,
    message: [
      {
        id: '0',
        type: BuddyNotificationType.ACCEPTED_YOUR_APPLICATION,
        hasBeenViewed: false,
        otherUser: {
          id: '1',
          name: 'james',
          gender: Gender.MALE,
          telegramHandle: 'james',
          faculty: Faculty.ARTS_AND_SOCIAL_SCIENCES,
          year: 2020,
          profilePhoto: '',
          thumbnailPhoto: '',
        },
        data: {
          post: {
            id: '0',
            poster: {
              id: '0',
              name: 'murph',
              gender: Gender.MALE,
              telegramHandle: 'murph00',
              faculty: Faculty.ARTS_AND_SOCIAL_SCIENCES,
              year: 2020,
              profilePhoto: '',
              thumbnailPhoto: '',
            },
            startDateTime: new Date().toISOString(),
            endDateTime: new Date().toISOString(),
            personCapacity: 4,
            participants: [],
            location: Location.BIZ,
            description: 'yo',
          },
          status: AppliedRequestStatus.ACCEPTED,
        },
      },
    ],
  });
}

export function markNotificationAsViewed(id: string) {
  return Promise.resolve({ success: true, message: '' });
}
