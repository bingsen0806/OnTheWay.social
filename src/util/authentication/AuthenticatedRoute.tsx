import { Redirect, Route } from 'react-router-dom';
import { useAuthState } from '.';
import { EMAIL_VERIFICATION, LOGIN } from '../../routes';

interface AuthenticatedRouteProps {
  exact?: boolean;
  path: string;
  component: React.ComponentType<any>;
}

export default function AuthenticatedRoute({
  exact,
  path,
  component,
}: AuthenticatedRouteProps) {
  const { isAuthenticated, isEmailVerified } = useAuthState();
  console.log('auth');
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => {
        if (isAuthenticated) {
          if (isEmailVerified || path === EMAIL_VERIFICATION) {
            return <Route {...props} component={component} />;
          }
          return (
            <Redirect
              to={{
                pathname: EMAIL_VERIFICATION,
                state: { from: props.location },
              }}
            />
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: LOGIN,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
}
