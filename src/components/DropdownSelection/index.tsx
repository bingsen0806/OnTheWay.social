import { IonLabel, IonSelect, IonSelectOption, isPlatform } from '@ionic/react';
import { useState } from 'react';
import styles from './styles.module.scss';

export interface DropdownItem<T> {
  label: string;
  value: T;
  // default would be that a dropdown item cannot be left unselected
  canBeLeftBlank?: boolean;
}

export interface DropdownSelectionProps<T> {
  dropdownItems: DropdownItem<T>[];
  placeholder: string;
  onChange: (value: T) => void;
  onCancel?: () => void;
  onDismiss?: () => void;
  // boolean to indicate if should show error message of no selection being chosen
  shouldShowError?: boolean;
}

function getSelectInterfaceType() {
  if (isPlatform('mobile')) {
    return 'action-sheet';
  } else {
    return 'popover';
  }
}

const popoverDropdownOptions = {
  alignment: 'end',
};

export default function DropdownSelection<T>({
  dropdownItems,
  placeholder,
  onChange,
  onCancel,
  onDismiss,
  shouldShowError,
}: DropdownSelectionProps<T>) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  return (
    <>
      <div className={styles['input-container']}>
        <IonSelect
          interface={getSelectInterfaceType()}
          interfaceOptions={popoverDropdownOptions}
          placeholder={placeholder}
          onIonChange={(e) => {
            setIsSelected(true);
            onChange(e.target.value as T);
          }}
          onIonCancel={onCancel}
          onIonDismiss={onDismiss}
        >
          {dropdownItems.map((item) => (
            <IonSelectOption key={item.label} value={item.value}>
              {item.label}
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>
      {shouldShowError && !isSelected && (
        <IonLabel className={styles['error-text']} color="danger">
          Please select an option.
        </IonLabel>
      )}
    </>
  );
}
