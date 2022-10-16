import { IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import styles from './styles.module.scss';

interface TextInputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  multiline?: boolean;
  rows?: number;
  errorMessage?: string;
  placeholder?: string;
  debounce?: number;
  maxlength?: number;
  type?: 'password' | 'text';
  showLabel?: boolean;
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
  showLabel,
}: TextInputFieldProps) {
  return (
    <>
      <IonItem lines="full">
        {!multiline ? (
          <>
            <IonLabel position="floating">{label}</IonLabel>
            <IonInput
              value={value}
              placeholder={placeholder}
              debounce={debounce ? debounce : 0}
              onIonChange={
                onChange ? (e) => onChange(e.detail.value!) : undefined
              }
              maxlength={maxlength}
              type={type}
            />
          </>
        ) : (
          <div className={styles['multiline-container']}>
            <IonLabel>{label}</IonLabel>
            <IonTextarea
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
