import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import {
  useState,
  useContext,
  createContext,
  PropsWithChildren,
  useLayoutEffect,
} from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { getInitialData } from '../../redux/slices/homeSlice';
import { getInitialPostsData } from '../../redux/slices/postsSlice';
import { getInitialSelf } from '../../redux/slices/userSlice';

export interface AuthenticationState {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  // firebase user object of the current authenticated user
  user?: User | null;
  error?: Error | null;
  reloadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthenticationState>(
  {} as AuthenticationState
);

export const AuthProvider = ({ children, ...rest }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>();
  const [error, setError] = useState<Error | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user) => {
        setUser(user);
        const promises: Promise<any>[] = [dispatch(getInitialPostsData())];
        if (user) {
          promises.push(dispatch(getInitialData()));
          promises.push(dispatch(getInitialSelf()));
        }
        void Promise.all(promises).then(() => {
          setLoading(false);
        });
      },
      setError
    );
    return () => unsubscribe();
  }, []);

  const reloadUser = async () => {
    try {
      let auth = getAuth();
      if (!auth.currentUser) {
        throw new Error('User not signed in.');
      }
      await auth.currentUser.reload();
      auth = getAuth();
      setUser(Object.assign({}, auth.currentUser));
      setLoading(false);
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user ? true : false,
        isLoading: loading,
        error,
        isEmailVerified: user?.emailVerified ? true : false,
        reloadUser,
      }}
      {...rest}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => {
  const auth = useContext(AuthContext);
  return auth;
};
