import { Redirect, Route } from 'react-router-dom';
import { useAuthState } from '.';
import { LOGIN } from '../../routes';

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
