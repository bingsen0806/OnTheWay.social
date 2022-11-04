export function isValidNUSEmail(email: string) {
  return (
    email.endsWith('@u.nus.edu') ||
    email.endsWith('nus.edu.sg') ||
    process.env.REACT_APP_FIREBASE_ENV === 'development'
  );
}
