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
  getPlatforms,
  useIonViewDidEnter,
} from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateFaqs } from '../../redux/slices/faqSlice';
export default function Faq() {
  const FAQs = useAppSelector((state) => state.faq.faqs);
  const isMobile = getPlatforms().includes('mobile');
  const dispatch = useAppDispatch();
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

  useIonViewDidEnter(() => {
    dispatch(updateFaqs());
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>FAQ</IonTitle>
          {isMobile && (
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
          )}
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
