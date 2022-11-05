import styles from './styles.module.scss';
import Loading from '../../assets/loading.json';
import Lottie from 'lottie-react';
import { useState } from 'react';

export default function FullScreenLoadingSpinner() {
  const [time, setTime] = useState(0);
  setInterval(() => setTime((prev) => prev + 1), 1);
  const message =
    time < 30000
      ? 'Getting things ready...'
      : time < 100000
      ? 'Almost there...'
      : 'Anytime now...';
  return (
    <>
      <Lottie animationData={Loading} loop={true} className={styles['icon']} />
      <p className="ion-text-center">{message}</p>
    </>
  );
}
