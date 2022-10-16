/**
 * Contains all possible checked errors
 * These are errors that should be displayed to the user in some form.
 */

export enum ErrorType {
  NOT_AUTHENTICATED = 'User ID cannot be determined',
  USER_NOT_FOUND = 'Could not find user in DB',
  USER_PROFILE_NOT_CREATED = 'Current user profile not found in DB',
  TELEGRAM_HANDLE_IN_USE = 'Telegram handle has been used',
  USERNAME_IN_USE = 'Username has been used',
  TELE_AND_USERNAME_IN_USE = 'Telegram handle and username have been used',
  POST_NOT_FOUND = 'Could not find post in DB',
  POST_ALREADY_APPLIED = 'User already applied for this post',
  DATE_MORE_THAN_14_FROM_NOW = 'Date is more than 14 days away from now',
  APPLIED_REQUEST_NOT_FOUND = 'Could not find post application in DB',
  APPLICATION_TO_POST_DELETED = 'User is not participanting in post',
}
