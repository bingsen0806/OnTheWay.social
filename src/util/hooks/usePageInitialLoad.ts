import { useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { useRef } from 'react';

/**
 * Custom hook that handles initial loading of data for a page.
 * Prevents excessive reloading using the loadCount ref.
 */
export default function usePageInitialLoad(loadFunc: () => void) {
  const loadCount = useRef<number>(0);
  useIonViewWillEnter(() => {
    if (loadCount.current === 0) {
      loadCount.current += 1;
      loadFunc();
    }
  });
  useIonViewDidLeave(() => {
    loadCount.current = 0;
  });
}
