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
  startDateTime: Date;
  endDateTime: Date;
  personCapacity: number;
  /** List of users who have been confirmed to be going for the post event */
  currPersons: User[];
  location: Location;
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
