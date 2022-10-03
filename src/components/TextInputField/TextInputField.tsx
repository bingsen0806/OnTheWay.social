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
}: TextInputFieldProps) {
  return (
    <IonItem lines="none" className={styles['input-container']}>
      {errorMessage ? (
        <IonLabel color="danger" position="stacked">
          <h6>{errorMessage}</h6>
        </IonLabel>
      ) : (
        <IonLabel color="default " position="floating">
          <h6>{label}</h6>
        </IonLabel>
      )}

      {!multiline ? (
        <IonInput
          value={value}
          placeholder={placeholder}
          debounce={debounce ? debounce : 0}
          onIonChange={onChange ? (e) => onChange(e.detail.value!) : undefined}
          maxlength={maxlength ? maxlength : undefined}
          type={type}
        />
      ) : (
        <IonTextarea
          placeholder={placeholder}
          debounce={debounce ? debounce : 0}
          className={styles.customTextArea}
          value={value}
          onIonChange={onChange ? (e) => onChange(e.detail.value!) : undefined}
          rows={rows}
          style={{ height: String(rows + 4) + 'rem' }}
          autoGrow={true}
        />
      )}
    </IonItem>
  );
}
