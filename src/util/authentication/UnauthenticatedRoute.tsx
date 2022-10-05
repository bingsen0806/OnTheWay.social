import { Redirect, Route } from 'react-router-dom';
import { useAuthState } from '.';
import { EMAIL_VERIFICATION, PROFILE } from '../../routes';

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
                  pathname: PROFILE,
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
