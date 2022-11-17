import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useHistory } from 'react-router';
import { BROWSE } from '../../routes';
import styles from './styles.module.scss';
function Hero() {
  const history = useHistory();
  const redirectToBrowse = () => {
    history.push(BROWSE);
  };

  return (
    <div className={styles['hero']}>
      <IonGrid>
        <IonRow className="ion-align-items-center">
          <IonCol size="12" sizeMd="6">
            <div className={styles['contents']}>
              <h1 className={styles['title']}>Enrich your student life</h1>
              <p className={styles['description']}>
                Find a fellow student for your next study session, boost your
                productivity and make new friends
              </p>
              <IonButton onClick={redirectToBrowse}>Browse Sessions</IonButton>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
}

export default Hero;
