import { useTranslation } from 'react-i18next';

import work1 from 'shared/assets/img/work1.svg';
import work2 from 'shared/assets/img/work2.svg';
import work3 from 'shared/assets/img/work3.svg';
import work4 from 'shared/assets/img/work4.svg';

import styles from './styles.module.scss';

export const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.works}`}>
      <div className={styles.worksWrap}>
        <h2 className={styles.worksTitle}>{t('works.title')}</h2>
        <div className={styles.worksContent}>
          <div className={styles.worksItem}>
            <div className={styles.worksItemIcon}>
              <img src={work1} alt={t('works.item_1')} />
            </div>
            <div className={styles.worksItemText}>{t('works.item_1')}</div>
          </div>
          <div className={styles.worksItem}>
            <div className={styles.worksItemIcon}>
              <img src={work2} alt={t('works.item_2')} />
            </div>
            <div className={styles.worksItemText}>{t('works.item_2')}</div>
          </div>
          <div className={styles.worksItem}>
            <div className={styles.worksItemIcon}>
              <img src={work3} alt={t('works.item_3')} />
            </div>
            <div className={styles.worksItemText}>{t('works.item_3')}</div>
          </div>
          <div className={styles.worksItem}>
            <div className={styles.worksItemIcon}>
              <img src={work4} alt={t('works.item_4')} />
            </div>
            <div className={styles.worksItemText}>{t('works.item_4')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
