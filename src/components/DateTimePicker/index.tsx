import {
  DatetimeCustomEvent,
  IonDatetime,
  IonDatetimeButton,
  IonLabel,
  IonModal,
} from '@ionic/react';
import moment from 'moment';
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
  const fourteen = moment().add(15, 'days').toISOString();
  const today = new Date().toISOString();
  const todayDate = today.split('T')[0];
  const min =
    type === 'date' ? new Date().toISOString() : `${todayDate}T08:00:00.000Z`;
  const max = type === 'date' ? fourteen : `${todayDate}T22:00:00.000Z`;

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
          max={max}
          min={min}
          value={value}
          minuteValues="0,15,30,45"
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
