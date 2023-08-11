import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from 'features/switch-language';
import { Modal } from 'shared/ui/modal';
import styles from './styles.module.scss';

type propTypes = { isAuctionPage?: boolean };

export const Footer = ({ isAuctionPage }: propTypes) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const { t } = useTranslation();

  return <footer className={`${styles.root} ${isAuctionPage ? styles.aucfooter : ''}`}>
    <div className="container">
      <div className={styles.inner}>
        <span className={styles.copyright}>{t('footer.copyright')}</span>

        <div className={styles.nav}>
          <Link to="/completed">{t('completed.title')}</Link>

          <div className={`${styles.navbox} hide-highlight`}>
            <button onClick={() => setShowDisclaimer(true)}>
              {t('disclaimer.title')}
            </button>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>

    <AnimatePresence>
      {showDisclaimer && <Modal closeModal={() => setShowDisclaimer(false)}>
        <h3>{t('disclaimer.title')}</h3>

        <div className={styles.disclaimer}>
          <p>{t('disclaimer.p1')}</p>
          <p>{t('disclaimer.p2')}</p>
          <p>{t('disclaimer.p3')}</p>
          <p>{t('disclaimer.p4')}</p>
          <p>{t('disclaimer.p5')}</p>
          <p>{t('disclaimer.p6')}</p>
        </div>
      </Modal>}
    </AnimatePresence>
  </footer>
};
