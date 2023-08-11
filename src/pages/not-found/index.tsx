import { useTranslation } from 'react-i18next';

import { Layout } from 'shared/ui/layout';
import { Footer } from 'widgets/footer';
import { Header } from 'widgets/header';
import image404 from 'shared/assets/img/notfound404.svg';

import styles from './styles.module.scss';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Layout isScrollable={false}>
      <Header />
      <div className="container">
        <div className={styles.root}>
          <img src={image404} alt="" />
          <h1>{t('errors.title')}</h1>
          <p>{t('errors.notfound')}</p>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default NotFoundPage;
