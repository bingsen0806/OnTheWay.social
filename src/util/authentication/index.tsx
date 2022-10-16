import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import {
  useState,
  useContext,
  createContext,
  PropsWithChildren,
  useLayoutEffect,
} from 'react';

export interface AuthenticationState {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
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

  useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError);
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
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user ? true : false,
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
