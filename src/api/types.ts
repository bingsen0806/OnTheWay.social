/**
 * Type definition for main classes in the application.
 */

export enum Gender {
  MALE,
  FEMALE,
  PREFER_NOT_TO_SAY,
}

export function genderEnumToStr(gender: Gender) {
  switch (gender) {
    case Gender.MALE:
      return 'Male';
    case Gender.FEMALE:
      return 'female';
    case Gender.PREFER_NOT_TO_SAY:
      return 'Prefer not to say';
  }
}

export enum Faculty {
  ARTS_AND_SOCIAL_SCIENCES,
  BUSINESS,
  COMPUTING,
  DENTISTRY,
  DESIGN_AND_ENGINEERING,
  LAW,
  MEDICINE,
  MUSIC,
  SCIENCE,
}

export function facultyEnumToStr(faculty: Faculty) {
  switch (faculty) {
    case Faculty.ARTS_AND_SOCIAL_SCIENCES:
      return 'Arts & Social Sciences';
    case Faculty.BUSINESS:
      return 'Business';
    case Faculty.COMPUTING:
      return 'Computing';
    case Faculty.DENTISTRY:
      return 'Dentistry';
    case Faculty.DESIGN_AND_ENGINEERING:
      return 'Design & Engineering';
    case Faculty.LAW:
      return 'Law';
    case Faculty.MEDICINE:
      return 'Medicine';
    case Faculty.MUSIC:
      return 'Music';
    case Faculty.SCIENCE:
      return 'Science';
  }
}

export enum Location {
  CLB,
  UTOWN,
  SCIENCE,
  FASS,
  ENGINEERING,
  BIZ,
  SDE,
  SOC,
  LAW,
}

export enum DayOfTheWeek {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

export enum TimeOfDay {
  MORNING,
  AFTERNOON,
  EVENING,
  NIGHT,
}

export interface PostsFilter {
  days: DayOfTheWeek[];
  timesOfDay: TimeOfDay[];
  locations: Location[];
}

export function locationEnumToStr(location: Location) {
  switch (location) {
    case Location.CLB:
      return 'Central Library';
    case Location.UTOWN:
      return 'UTown';
    case Location.SCIENCE:
      return 'Science';
    case Location.FASS:
      return 'FASS';
    case Location.ENGINEERING:
      return 'Engineering';
    case Location.BIZ:
      return 'Biz';
    case Location.SDE:
      return 'SDE';
    case Location.SOC:
      return 'SOC';
    case Location.LAW:
      return 'Law';
  }
}

export function dayOfTheWeekEnumToStr(day: DayOfTheWeek) {
  switch (day) {
    case DayOfTheWeek.MONDAY:
      return 'Monday';
    case DayOfTheWeek.TUESDAY:
      return 'Tuesday';
    case DayOfTheWeek.WEDNESDAY:
      return 'Wednesday';
    case DayOfTheWeek.THURSDAY:
      return 'Thursday';
    case DayOfTheWeek.FRIDAY:
      return 'Friday';
    case DayOfTheWeek.SATURDAY:
      return 'Saturday';
    case DayOfTheWeek.SUNDAY:
      return 'Sunday';
  }
}

export function timeOfDayEnumToStr(time: TimeOfDay) {
  switch (time) {
    case TimeOfDay.MORNING:
      return 'Morning';
    case TimeOfDay.AFTERNOON:
      return 'Afternoon';
    case TimeOfDay.EVENING:
      return 'Evening';
    case TimeOfDay.NIGHT:
      return 'Night';
  }
}

export type Art = {
  id: string;
  prompt: string;
  date: string;
  userId: string;
  description: string;
  image: string;
  isPublic: boolean;
};

/**
 * Status values for a request.
 */
export enum AppliedRequestStatus {
  ACCEPTED,
  PENDING,
  REJECTED,
}

export interface Campaign {
  id: string;
  userId: string;
  chances: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  image: string;
  tncs: string;
}

/**
 * Contains all fields for a User.
 */
export interface User {
  id: string;
  name: string;
  gender: Gender;
  faculty: Faculty;
  telegramHandle: string;
  year: number;
  profilePhoto: string;
  thumbnailPhoto: string;
  art?: Art[];
}

export interface UserHistory {
  totalCreatedStudySessions: number;
  totalAppliedStudySessons: number;
  numPeopleMet: number;
  totalStudyHours: number;
  recentBuddies: User[];
  recentStudySessions: Post[];
}

/**
 * Contains all fields for a Post.
 */
export interface Post {
  id: string;
  poster: User;
  startDateTime: string;
  endDateTime: string;
  personCapacity: number;
  /** List of users who have been confirmed to be going for the post event */
  participants: User[];
  location: Location;
  description: string;
}

export enum BuddyNotificationType {
  APPLIED_TO_YOUR_POST,
  CANCELLED_THEIR_APPLICATION,
  ACCEPTED_YOUR_APPLICATION,
  DELETED_POST_YOU_APPLIED_FOR,
  GENERIC_MESSAGE,
  RECEIVED_NEW_ART,
}

export interface BuddyNotification {
  id: string;
  type: BuddyNotificationType;
  hasBeenViewed: boolean;
  otherUser?: User;
  title?: string;
  data?: AppliedRequest | CreatedRequest | string | Post;
}

/**
 * Contains all details for an applied request.
 */
export interface AppliedRequest {
  post: Post;
  status: AppliedRequestStatus;
}

/**
 * Contains all details for a created request.
 */
export interface CreatedRequest {
  post: Post;
  /** List of users who have applied for this post */
  applicants: User[];
}

export interface ApiResponseBody<T> {
  success: boolean;
  message: T | string;
}

export interface ApiRequestBody {
  /* eslint-disable */
  [key: string]: any;
}
