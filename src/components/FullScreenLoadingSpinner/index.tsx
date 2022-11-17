import styles from './styles.module.scss';
import Loading from '../../assets/loading.json';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';

export default function FullScreenLoadingSpinner() {
  const [time, setTime] = useState(0);
  const message =
    time < 3000
      ? 'Getting things ready...'
      : time < 10000
      ? 'Almost there...'
      : 'Anytime now...';

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevCount) => prevCount + 1000);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <IonPage>
      <IonContent>
        <Lottie
          animationData={Loading}
          loop={true}
          className={styles['icon']}
        />
        <p className="ion-text-center">{message}</p>
      </IonContent>
    </IonPage>
  );
}
