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
    //console.log(e.detail.value)
    console.log(value);
  }
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const maxDate = moment().add(7, 'days').toISOString();
  const min = type === 'date' ? new Date().toISOString() : undefined;
  const max = type === 'date' ? maxDate : undefined;

  return (
    <>
      <IonItem
        lines="full"
        button
        detail={false}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <IonLabel>
          <h2>{`${label}: `}</h2>
        </IonLabel>
        <IonLabel slot="end">
          <h2>
            {`
            ${
              type === 'date'
                ? moment(value, true).format('DD/MM/YYYY')
                : moment(value, true).format('HH:mm A')
            }`}
          </h2>
        </IonLabel>

        <IonDatetimeButton
          datetime={`datetime-${label}`}
          className={styles['datetime-button']}
        ></IonDatetimeButton>
        <IonModal
          keepContentsMounted={true}
          isOpen={isOpen}
          onWillDismiss={() => {
            setIsOpen(false);
          }}
        >
          <IonDatetime
            id={`datetime-${label}`}
            max={max}
            min={min}
            value={value}
            className={styles['date-picker']}
            presentation={type}
            onIonChange={handleChange}
            minuteValues="0, 15, 30, 45"
            showDefaultTitle
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
