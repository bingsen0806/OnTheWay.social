import React, { useState } from 'react';
import styles from './styles.module.scss';
import cat from '../../assets/cat.json';
import snow from '../../assets/snow.json';
import Lottie from 'lottie-react';
import { useHistory, useLocation } from 'react-router-dom';
import { FAQ, FEEDBACK, HOME, INSTAGRAM } from '../../routes';
function Footer() {
  const location = useLocation();
  const pathName = location.pathname;
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const history = useHistory();
  const routeToFaq = () => {
    history.replace(FAQ);
  };
  const openInstagram = () => {
    window.open(INSTAGRAM, '_blank');
  };

  const routeToHome = () => {
    if (pathName.includes(HOME)) {
      return;
    }
    history.replace(HOME);
  };
  const openFeedback = () => {
    window.open(FEEDBACK, '_blank');
  };

  return (
    <div className={styles.footer}>
      <Lottie
        className={styles['animation-snow']}
        animationData={snow}
        loop={true}
      />
      <Lottie
        onClick={() => setIsAnimating(true)}
        onAnimationEnd={() => setIsAnimating(false)}
        className={
          isAnimating ? styles['moving-animation'] : styles['animation']
        }
        animationData={cat}
        loop={true}
      />
      <div slot="start" className={styles['footer-toolbar']}>
        <span
          className={`${styles['footer-text']} ion-margin-horizontal`}
          onClick={routeToHome}
        >
          BuddyNUS
        </span>
        <span
          onClick={routeToFaq}
          className={`${styles['footer-text']} ion-margin-horizontal`}
        >
          FAQ
        </span>
        <span
          onClick={openInstagram}
          className={`${styles['footer-text']} ion-margin-horizontal`}
        >
          Instagram
        </span>
        <span
          onClick={openFeedback}
          className={`${styles['footer-text']} ion-margin-horizontal`}
        >
          Feedback
        </span>
      </div>
    </div>
  );
}

export default Footer;
