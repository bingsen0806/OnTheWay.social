import { IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import styles from './styles.module.scss';

interface TextInputFieldProps {
  name?: string;
  value: string;
  autocomplete?: 'name' | 'email' | 'tel' | 'username';
  onChange?: (value: string) => void;
  label?: string;
  multiline?: boolean;
  rows?: number;
  errorMessage?: string;
  placeholder?: string;
  debounce?: number;
  maxlength?: number;
  type?: 'password' | 'text';
}

export default function TextInputField({
  value,
  onChange,
  label,
  multiline = false,
  rows = 3,
  errorMessage,
  placeholder,
  debounce,
  maxlength,
  type,
  name,
}: TextInputFieldProps) {
  return (
    <>
      <IonItem lines="full">
        {!multiline ? (
          <>
            <IonLabel position="floating">{label}</IonLabel>
            <IonInput
              name={name}
              autocomplete="on"
              value={value}
              placeholder={placeholder}
              debounce={debounce ? debounce : 0}
              onIonChange={
                onChange ? (e) => onChange(e.detail.value!) : undefined
              }
              maxlength={maxlength}
              type={type}
              className={styles['input-field']}
            />
          </>
        ) : (
          <div className={styles['multiline-container']}>
            <IonLabel>{label}</IonLabel>
            <IonTextarea
              name={name}
              className="ion-no-padding"
              placeholder={placeholder}
              debounce={debounce ? debounce : 0}
              value={value}
              onIonChange={
                onChange ? (e) => onChange(e.detail.value!) : undefined
              }
              rows={rows}
              maxlength={maxlength}
              autoGrow
            />
            <p className="ion-no-margin ion-padding-bottom">
              {value?.length ? value.length : 0} / {maxlength}
            </p>
          </div>
        )}
      </IonItem>
      {errorMessage && (
        <IonLabel color="danger" className="ion-padding-start">
          {errorMessage}
        </IonLabel>
      )}
    </>
  );
}
