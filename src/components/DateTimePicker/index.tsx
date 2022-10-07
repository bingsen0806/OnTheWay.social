import {
  DatetimeCustomEvent,
  IonDatetime,
  IonDatetimeButton,
  IonLabel,
  IonModal,
} from '@ionic/react';
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

  return (
    <div className={styles['input-container']}>
      <IonLabel className={styles['date-picker-label']}>{label}</IonLabel>
      <div>
        <IonDatetimeButton
          className="ion-justify-content-start"
          datetime={`datetime-${label}`}
        ></IonDatetimeButton>
      </div>
      <IonModal keepContentsMounted={true}>
        <IonDatetime
          value={value}
          className={styles['date-picker']}
          id={`datetime-${label}`}
          presentation={type}
          onIonChange={handleChange}
        ></IonDatetime>
      </IonModal>
      {errorMessage && (
        <IonLabel color="danger" className={styles['date-picker-label']}>
          {errorMessage}
        </IonLabel>
      )}
    </div>
  );
}
