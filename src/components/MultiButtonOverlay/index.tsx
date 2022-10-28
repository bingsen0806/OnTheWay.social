import { IonItem, IonLabel, IonList } from '@ionic/react';
import { useEffect, useRef } from 'react';
import styles from './styles.module.scss';

export interface ButtonProps {
  name: string;
  action: () => void;
}

export interface MultiButtonOverlayProps {
  buttons: ButtonProps[];
  isShowing: boolean;
  setIsShowing: (state: boolean) => void;
}

export default function MultiButtonOverlay({
  buttons,
  isShowing,
  setIsShowing,
}: MultiButtonOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  // set up listener to detect clicks outside the overlay
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsShowing(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return isShowing ? (
    <div className={styles['overlay-container']} ref={ref}>
      <IonList>
        {buttons.map((button) => (
          <IonItem button onClick={button.action} key={button.name}>
            <IonLabel>{button.name}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  ) : null;
}
