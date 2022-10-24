import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import { useHistory } from 'react-router';
import noArtScreen from '../../assets/art.jpg';
import { HOME } from '../../routes';
import styles from './styles.module.scss';

function EmptyArtPage() {
  const history = useHistory();
  return (
    <div className="ion-margin">
      <img src={noArtScreen} className={styles['empty-image']} />
      <IonGrid>
        <IonRow className={'ion-text-center ' + styles['row']}>
          <IonCol size="10" sizeMd="8" sizeLg="6">
            <h3>
              Get your very own piece of custom made digital art for free!
            </h3>
            <p>
              Everytime you create, apply for a study session or accept an
              applicant, you have a chance of receiving an AI-generated piece of
              art owned only by you. That's right! A unique art made just for
              you! This art is publicly visible by other users and can be shared
              on your social media.
            </p>
            <IonButton
              onClick={() => {
                history.push(HOME);
              }}
              expand="block"
            >
              Browse study sessions
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
}

export default EmptyArtPage;
