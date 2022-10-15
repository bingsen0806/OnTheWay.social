import { IonSpinner } from '@ionic/react';
import styles from './styles.module.scss';

export default function LoadingSpinner() {
  return (
    <IonSpinner
      name="crescent"
      className={styles['spinner-container']}
      color="primary"
    />
  );
}
