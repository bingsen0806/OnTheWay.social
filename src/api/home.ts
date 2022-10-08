/**
 * TODO: add firebase functions here for api calls
 */

import {
  AppliedRequest,
  AppliedRequestStatus,
  CreatedRequest,
  Faculty,
  Gender,
  Location,
} from './types';

export async function getAppliedRequests(page: number) {
  return Promise.resolve<AppliedRequest[]>([
    {
      post: {
        id: '0',
        poster: {
          id: '0',
          name: 'Ben',
          gender: Gender.MALE,
          faculty: Faculty.COMPUTING,
          telegramHandle: 'murph99',
          year: 3,
          profilePhoto: '',
          thumbnailPhoto: '',
        },
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        personCapacity: 5,
        participants: [],
        location: Location.SOC,
        description: 'Hello, feel free to meet',
      },
      status: AppliedRequestStatus.ACCEPTED,
    },
  ]);
}

export async function getCreatedRequests(page: number) {
  return Promise.resolve<CreatedRequest[]>([
    {
      post: {
        id: '0',
        poster: {
          id: '0',
          name: 'Ben',
          gender: Gender.MALE,
          faculty: Faculty.COMPUTING,
          telegramHandle: 'murph99',
          year: 3,
          profilePhoto: '',
          thumbnailPhoto: '',
        },
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        personCapacity: 5,
        participants: [],
        location: Location.SOC,
        description: 'Hello, feel free to meet',
      },
      applicants: [],
    },
  ]);
}

export async function cancelRequest(postId: string) {
  return Promise.resolve();
}
