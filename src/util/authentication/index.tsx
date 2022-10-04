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
  // firabase user object of the current authenticated user
  user?: User | null;
  error?: Error | null;
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user ? true : false,
        error,
        isEmailVerified: user?.emailVerified ? true : false,
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
