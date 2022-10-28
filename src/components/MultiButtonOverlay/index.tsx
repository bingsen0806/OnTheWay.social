import { IonItem, IonLabel, IonList } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          className={styles['overlay-container']}
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
          }}
        >
          <IonList>
            {buttons.map((button) => (
              <IonItem button onClick={button.action} key={button.name}>
                <IonLabel>{button.name}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
