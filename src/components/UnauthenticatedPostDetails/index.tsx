import styles from './styles.module.scss';
import { useHistory } from 'react-router';
import { LOGIN, REGISTER } from '../../routes';

interface UnauthenticatedPostProps {
  closeDialog?: ((callback: () => void) => void) | (() => void);
}

function UnauthenticatedPostDetails({ closeDialog }: UnauthenticatedPostProps) {
  const history = useHistory();
  const routeToLogin = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (closeDialog) {
      closeDialog(() => {
        history.push(LOGIN);
      });
    } else {
      history.push(LOGIN);
    }
  };
  const routeToSignup = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (closeDialog) {
      closeDialog(() => {
        history.push(REGISTER);
      });
    } else {
      history.push(REGISTER);
    }
  };

  return (
    <div className="ion-text-center ion-no-margin ion-no-padding">
      <p>
        <span onClick={routeToLogin} className={styles['link-text']}>
          Login
        </span>{' '}
        or{' '}
        <span onClick={routeToSignup} className={styles['link-text']}>
          signup
        </span>{' '}
        to view more information about this session and apply for it!
      </p>
    </div>
  );
}

export default UnauthenticatedPostDetails;
