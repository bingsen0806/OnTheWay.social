import { createElement } from 'react';
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
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => {
        if (isAuthenticated) {
          if (isEmailVerified || path === EMAIL_VERIFICATION) {
            return createElement(component, { ...props }, null);
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
