import { IonButton, IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import styles from './styles.module.scss';

export default function LandingPage() {
  return (
    <IonContent>
      <div className={styles['header-container']}>
        <IonGrid className={styles['header-grid']}>
          <IonRow className="ion-justify-content-center ion-padding-bottom">
            <IonCol size="12" sizeMd="8" className="col-md-8">
              <h1 className={styles['header-text']}>
                Enrich your university experience
              </h1>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center ion-padding-bottom">
            <IonCol>
              <h4 className={styles['header-subtitle']}>
                A safe space for NUS students to find a study buddy instantly.
              </h4>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
      <div className={styles['main-content-container']}>
        <IonGrid>
          <IonRow>
            <IonCol>
              <h1
                className={`ion-text-center ${styles['content-container-header-text']}`}
              >
                How it works
              </h1>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol
              size="12"
              size-md="6"
              className={styles['content-item-container']}
            >
              <img
                src="assets/icons/university.svg"
                className={styles['content-icon']}
              ></img>
              <IonCol className="d-flex flex-column col-md-6 flex-grow-1">
                <h5 className={styles['content-item-header']}>
                  Spending some time studying in NUS?
                </h5>
                <p className={styles['content-item-text']}>
                  Find a study buddy instantly among our user base of verified
                  NUS students who are looking for a study buddy at the same
                  time
                </p>
              </IonCol>
            </IonCol>
            <IonCol
              size="12"
              sizeMd="6"
              className={styles['content-item-container']}
            >
              <img
                src="assets/icons/mail.svg"
                className={styles['content-icon']}
              ></img>
              <IonCol className="d-flex flex-grow-1">
                <h5 className={styles['content-item-header']}>
                  Verified Students Only
                </h5>
                <p className={styles['content-item-text']}>
                  We collect and verify NUS email addresses to ensure all
                  members are part of our community
                </p>
              </IonCol>
            </IonCol>
          </IonRow>
          <IonRow className="row">
            <IonCol
              size="12"
              sizeMd="6"
              className={styles['content-item-container']}
            >
              <img
                src="assets/icons/group.svg"
                className={styles['content-icon']}
              ></img>
              <IonCol className="d-flex flex-grow-1">
                <h5 className={styles['content-item-header']}>
                  Forge Friendships
                </h5>
                <p className={styles['content-item-text']}>
                  NUS life can be busy and stressful. That doesnt mean we can't
                  socialize! Find a study buddy to endure tough times together
                  {':)'}
                </p>
              </IonCol>
            </IonCol>
            <IonCol
              size="12"
              sizeMd="6"
              className={styles['content-item-container']}
            >
              <img
                src="assets/icons/lock.svg"
                className={styles['content-icon']}
              ></img>
              <IonCol className="d-flex flex-column flex-grow-1">
                <h5 className={styles['content-item-header']}>
                  Privacy is important
                </h5>
                <p className={styles['content-item-text']}>
                  We value safe spaces to socialize. Minimal personal details
                  are collected and they are only shared with others with your
                  approval.
                </p>
              </IonCol>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
      <IonGrid className={styles['interest-container']}>
        <h1 className="ion-text-center py-3 py-md-4 mx-auto">
          <strong>Built by students, for students</strong>
        </h1>
        <p>
          Built by a passionate team of students who dream of a more connected
          NUS
        </p>
        <p>Launching in Mid-October, AY2022/23 Semester 1</p>
        <p>Indicate your interest now and be notified when we go live!</p>
        <IonRow className="ion-justify-content-center">
          <IonCol size="auto">
            <IonButton className={styles['interest-button']} href="/register">
              Sign up now!
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <div className={styles['footer-container']}>
        <IonGrid className="container">
          <IonRow>
            <IonCol>
              <h1
                className={`ion-text-center pt-3 py-md-4 ${styles['footer-container-header-text']}`}
              >
                Contact Us
              </h1>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="auto" className={styles['contact-link-column']}>
              <a
                href="mailto: contact@buddynus.com"
                className={styles['contact-link']}
              >
                <div className={styles['contact-link-container']}>
                  <img
                    className={styles['contact-icon']}
                    src="assets/icons/mail-white.svg"
                  />
                  <h6 className={styles['contact-text']}>
                    contact@buddynus.com
                  </h6>
                </div>
              </a>
            </IonCol>
            <IonCol size="auto" className={styles['contact-link-column']}>
              <a
                href="https://instagram.com/buddynus.official"
                className={styles['contact-link']}
                target="_blank"
                rel="noreferrer"
              >
                <div className={styles['contact-link-container']}>
                  <img
                    className={styles['contact-icon']}
                    src="assets/icons/instagram.svg"
                  />
                  <h6 className={styles['contact-text']}>buddynus.official</h6>
                </div>
              </a>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    </IonContent>
  );
}
