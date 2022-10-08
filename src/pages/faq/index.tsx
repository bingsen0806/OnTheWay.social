import styles from './styles.module.scss';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonAccordionGroup,
  IonAccordion,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useAppSelector } from '../../redux/hooks';
export default function Faq() {
  const FAQs = useAppSelector((state) => state.faq.faqs);
  const items = FAQs.map((faq, i) => (
    <IonAccordion value={i.toString()} color="light" key={faq.question}>
      <IonItem slot="header" color="light">
        <IonLabel>{faq.question}</IonLabel>
      </IonItem>
      <div className="ion-padding" slot="content">
        {faq.answer}
      </div>
    </IonAccordion>
  ));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>FAQ</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <h1 className="ion-text-center">Frequently asked questions</h1>
          <IonRow className={styles['row']}>
            <IonCol size="11" sizeMd="8" sizeLg="6">
              <IonAccordionGroup className={styles['bg']}>
                {items}
              </IonAccordionGroup>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
