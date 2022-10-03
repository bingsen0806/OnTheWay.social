import { Redirect, Route } from 'react-router-dom';
import { useAuthState } from '.';
import { HOME } from '../../routes';

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
  const { isAuthenticated } = useAuthState();
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => {
        if (!isAuthenticated) {
          return <Route {...props} component={component} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: HOME,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
}
