import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import VisibilitySensor from 'react-visibility-sensor';

function Info() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <div className={styles['info']}>
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
            <IonRow className="ion-align-items-center">
              <IonCol size="12" sizeLg="4">
                <h1 className={styles['title']}>
                  Expand your network, <br />
                  meet new people and coursemates
                </h1>
              </IonCol>
              <IonCol size="12" sizeLg="4">
                <div className={styles['subcontents']}>
                  <h4 className={styles['subtitle']}>
                    A diverse community within NUS
                  </h4>
                  <p>
                    OnTheWay connects you to fellow students across the
                    different faculties from NUS so you can meet people from
                    diverse backgrounds
                  </p>
                </div>
              </IonCol>
              <IonCol size="12" sizeLg="4">
                <div className={styles['subcontents']}>
                  <h4 className={styles['subtitle']}>
                    Verified NUS students only
                  </h4>
                  <p>
                    We collect and verify NUS email addresses to ensure all
                    members are part of our community
                  </p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </VisibilitySensor>
    </div>
  );
}

export default Info;
