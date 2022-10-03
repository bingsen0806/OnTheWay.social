import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import { LOGIN } from '../../routes';

/**
 * Sets up firebase authentication state change handler, navigate to login page whenever login fails.
 */
export default function useAuth() {
  const auth = getAuth();
  const history = useHistory();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      history.replace(LOGIN);
    }
  });
}
