import {
  DatetimeCustomEvent,
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonModal,
} from '@ionic/react';
import moment from 'moment';
import { useState } from 'react';
import styles from './styles.module.scss';

export interface DateTimePickerProps {
  label: string;
  onChange: (value: string) => void;
  type: 'time' | 'date-time' | 'date';
  errorMessage?: string;
  value?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  label,
  type,
  errorMessage,
}: DateTimePickerProps) {
  function handleChange(e: DatetimeCustomEvent) {
    onChange(e.detail.value ? (e.detail.value as string) : '');
  }
  const maxDate = moment().add(7, 'days').toISOString();
  const min = type === 'date' ? new Date().toISOString() : undefined;
  const max = type === 'date' ? maxDate : undefined;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IonItem
        lines="full"
        button
        onClick={() => {
          console.log('click');
          setIsOpen(true);
        }}
      >
        <IonLabel>
          <h2>{label}</h2>
        </IonLabel>
        <IonDatetimeButton
          slot="end"
          className="ion-justify-content-start"
          datetime={`datetime-${label}`}
        ></IonDatetimeButton>
        <IonModal
          keepContentsMounted={true}
          isOpen={isOpen}
          onDidDismiss={() => setIsOpen(false)}
        >
          <IonDatetime
            max={max}
            min={min}
            value={value}
            className={styles['date-picker']}
            id={`datetime-${label}`}
            presentation={type}
            onIonChange={handleChange}
            minuteValues="0, 15, 30, 45"
          ></IonDatetime>
        </IonModal>
      </IonItem>
      {errorMessage && (
        <IonLabel color="danger" className="ion-padding-start">
          {errorMessage}
        </IonLabel>
      )}
    </>
  );
}
