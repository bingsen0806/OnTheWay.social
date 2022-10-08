/* eslint-disable */
// @ts-nocheck
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import { useAuthState } from '.';
import { EMAIL_VERIFICATION, HOME } from '../../routes';

interface UnauthenticatedRouteProps {
  exact?: boolean;
  path: string;
  component: React.ComponentType<any>;
}

export default function UnauthenticatedRoute({
  exact,
  path,
  component,
}: UnauthenticatedRouteProps) {
  const { isAuthenticated, isEmailVerified } = useAuthState();
  const location = useLocation();
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => {
        if (!isAuthenticated) {
          return <Route {...props} component={component} />;
        } else {
          if (isEmailVerified || path === EMAIL_VERIFICATION) {
            return (
              <Redirect
                to={{
                  pathname: props.location.state?.from
                    ? props.location.state.from.pathname
                    : HOME,
                  state: { from: props.location },
                }}
              />
            );
          }
          return (
            <Redirect
              to={{
                pathname: EMAIL_VERIFICATION,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
}
