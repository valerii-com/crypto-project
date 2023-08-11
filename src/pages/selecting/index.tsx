import { useTranslation } from 'react-i18next';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { SelectNft } from 'features/create-auction';
import { ConnectWallet } from 'features/auth/connect-wallet';
import { Layout } from 'shared/ui/layout';
import { Button } from 'shared/ui/button';
import { Splitted } from 'shared/ui/splitted';
import placeholder from 'shared/assets/icons/preview.svg';
import noResultIllustration from 'shared/assets/img/cross.svg';

import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useAddressTokens } from 'shared/lib/useAddressTokens';
import { useWeb3React } from '@web3-react/core';
import { PhotoPlaceholder } from 'shared/ui/photo-placeholder';
import { Link } from 'react-router-dom';
import BackArrow from 'entities/auction/ui/back-arrow';
import { MoralisToken } from 'shared/interfaces/Morails';
import { SvgChoosedMark } from 'shared/assets/svg';
import { AnimatePresence } from 'framer-motion';

const SelectingPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Header />
      <div className={styles.wrapper}>
        <div className="container">
          <div className={styles.inner}>
            <Link to="/" className={styles.back}>
              <BackArrow
                title={t('creating.title')}
                subtitle={t('upcomings.back-one')}
              />
            </Link>
            <div className={styles.heading}>
              <div className={styles.title}>
                <b>Select NFT to sell</b>
                <span>|</span>
                <b>Step 1 / 2</b>
              </div>
            </div>
          </div>
        </div>
        <SelectNft>
          <Footer />
        </SelectNft>
      </div>
    </Layout>
  );
};

export default SelectingPage;
