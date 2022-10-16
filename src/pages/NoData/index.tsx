import noDataScreen from '../../assets/nodata.jpg';
import styles from './styles.module.scss';

import { IonGrid, IonRow } from '@ionic/react';

interface NoDataContents {
  children: JSX.Element;
}

export default function NoData({ children }: NoDataContents) {
  return (
    <>
      <img className={styles['center-image']} src={noDataScreen} />
      <IonGrid className={styles.row}>
        <IonRow>{children}</IonRow>
      </IonGrid>
    </>
  );
}