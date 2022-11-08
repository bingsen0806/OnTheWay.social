export function isValidNUSEmail(email: string) {
  return (
    email.toLowerCase().endsWith('@u.nus.edu') ||
    email.toLowerCase().endsWith('nus.edu.sg') ||
    process.env.REACT_APP_FIREBASE_ENV === 'development'
  );
}
