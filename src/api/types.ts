/**
 * Type definition for main classes in the application.
 */

export enum Gender {
  MALE,
  FEMALE,
  PREFER_NOT_TO_SAY,
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

/**
 * Status values for a request.
 */
export enum AppliedRequestStatus {
  ACCEPTED,
  PENDING,
  REJECTED,
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
}

/**
 * Contains all fields for a Post.
 */
export interface Post {
  id: string;
  poster: User;
  startDateTime: Date;
  endDateTime: Date;
  personCapacity: number;
  /** List of users who have been confirmed to be going for the post event */
  participants: User[];
  location: Location;
  description: string;
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
