import { Faculty, Gender, Location } from './types';

export interface PostsFilter {
  locations: Location[];
}

/**
 * Get a page of posts with given filter and page number.
 * TODO: add firebase func call.
 *
 */
export async function getPosts(filter: PostsFilter, page: number) {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        resolve([
          {
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
          {
            id: '1',
            poster: {
              id: '1',
              name: 'James',
              gender: Gender.MALE,
              faculty: Faculty.COMPUTING,
              telegramHandle: 'james99',
              year: 2,
              profilePhoto: '',
              thumbnailPhoto: '',
            },
            startDateTime: new Date().toISOString(),
            endDateTime: new Date().toISOString(),
            personCapacity: 3,
            participants: [],
            location: Location.FASS,
            description: 'Lookng forward to meeting new people!',
          },
        ]),
      1000
    )
  );
}
