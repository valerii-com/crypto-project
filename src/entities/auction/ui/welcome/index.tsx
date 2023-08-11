import { useTranslation } from 'react-i18next';

import Lottie from 'lottie-react';

import styles from './styles.module.scss';
import animation from './animation.json';

export const WelcomeLogo = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>
          {t('connectwallet.welcomeTitle')}
        </h1>
        <p className={styles.welcomeSubTitle}>
          {t('connectwallet.welcomeDescription')}
        </p>
        <a href="#auction" className={styles.button}>
          {t('connectwallet.welcomeButton')}
        </a>
      </div>
      <div className={styles.welcomeImage}>
        <Lottie
          animationData={animation}
          aria-labelledby="use lottie animation"
          style={{ position: 'relative', zIndex: '-1' }}
        />
      </div>
    </div>
  );
};
