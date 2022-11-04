import noDataScreen from '../../assets/nodata.json';
import styles from './styles.module.scss';
import Lottie from 'lottie-react';
import { IonGrid, IonRow } from '@ionic/react';

interface NoDataContents {
  children: JSX.Element;
  hideImage?: boolean;
}

export default function NoData({ children, hideImage }: NoDataContents) {
  return (
    <>
      {!hideImage && (
        <Lottie
          className={styles['animation']}
          animationData={noDataScreen}
          loop={true}
        />
      )}
      <IonGrid className={styles.row}>
        <IonRow>{children}</IonRow>
      </IonGrid>
    </>
  );
}
