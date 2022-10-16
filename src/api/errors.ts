/**
 * Contains all possible checked errors
 * These are errors that should be displayed to the user in some form.
 */

export enum ErrorType {
  NOT_AUTHENTICATED = 'User ID cannot be determined',
  USER_PROFILE_NOT_CREATED = 'User object cannot be found',
  TELEGRAM_HANDLE_IN_USE = 'Telegram handle has been used',
  USERNAME_IN_USE = 'User name has been used',
  TELE_AND_USERNAME_IN_USE = 'Telegram handle and user name have been used',
  USER_IS_NOT_POST_AUTHOR = 'User is not post author',
  POST_NOT_FOUND = 'Cannot find post Id',
  POST_ALREADY_APPLIED = 'User already applied for this post',
}
