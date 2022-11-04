import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import group from '../../assets/group.jpeg';
import { useHistory } from 'react-router';
import { BROWSE } from '../../routes';
import VisibilitySensor from 'react-visibility-sensor';

function Cta() {
  const history = useHistory();
  const redirectToBrowse = () => {
    history.push(BROWSE);
  };

  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div className={styles['cta']}>
      <VisibilitySensor
        onChange={(val: boolean) => {
          if (val) {
            setIsVisible(val);
          }
        }}
      >
        <div
          className={
            isVisible ? styles['contents-visible'] : styles['contents']
          }
        >
          <IonGrid>
            <IonRow className="ion-align-items-center ion-justify-content-space-between">
              <IonCol size="12" sizeLg="6">
                <img src={group} className={styles['img']} />
              </IonCol>
              <IonCol size="12" sizeLg="6">
                <h1 className={styles['title']}>Begin your journey</h1>
                <IonButton onClick={redirectToBrowse}>
                  Browse sessions
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </VisibilitySensor>
    </div>
  );
}

export default Cta;
