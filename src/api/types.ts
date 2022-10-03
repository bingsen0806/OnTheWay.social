/**
 * Type definition for main classes in the application.
 */

enum Gender {
  MALE,
  FEMALE,
  PREFER_NOT_TO_SAY,
}

enum Location {
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
enum AppliedRequestStatus {
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
  faculty: string;
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
