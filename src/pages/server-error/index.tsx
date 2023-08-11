import { useTranslation } from 'react-i18next';

import { Layout } from 'shared/ui/layout';

import image404 from 'shared/assets/img/cross.svg';

import styles from './styles.module.scss';

const ServerErrorPage = () => {
  const { t } = useTranslation();

  return (
    <Layout isScrollable={false}>
      <div className="container">
        <div className={styles.root}>
          <img src={image404} alt="" />
          <h1>{t('errors.title')}</h1>
          <p>{t('errors.description')}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ServerErrorPage;
