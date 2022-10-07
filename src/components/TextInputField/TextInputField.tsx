import { IonInput, IonLabel, IonTextarea } from '@ionic/react';
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
    <div className={styles['input-container']}>
      {label && (
        <IonLabel
          style={{ visibility: value ? 'visible' : 'hidden' }}
          className={styles['input-floating-label']}
        >
          {label}
        </IonLabel>
      )}
      {!multiline ? (
        <IonInput
          className="ion-no-padding"
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
          className="ion-no-padding"
          value={value}
          onIonChange={onChange ? (e) => onChange(e.detail.value!) : undefined}
          rows={rows}
          style={{ height: String(rows + 4) + 'rem' }}
          autoGrow={true}
        />
      )}
      {errorMessage && (
        <IonLabel className={styles['input-floating-label']} color="danger">
          {errorMessage}
        </IonLabel>
      )}
    </div>
  );
}
