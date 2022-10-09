/**
 * Contains all possible checked errors
 * These are errors that should be displayed to the user in some form.
 */

export enum ErrorType {
  NOT_AUTHENTICATED = "User ID cannot be determined",
  USER_PROFILE_NOT_CREATED = "Cannot fetch user data",
  USER_IS_NOT_POST_AUTHOR = "User is not post author",
}
