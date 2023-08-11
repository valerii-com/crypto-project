import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, useCycle } from 'framer-motion';
import classNames from 'classnames';

import { ConnectWallet } from 'features/auth/connect-wallet';
import {
  WrongNetworkModal,
  wrongNetworkState,
} from 'features/auth/wrong-network';
import { Logout } from 'features/auth/logout';
import { Viewer, viewerVar } from 'entities/viewer';
import { GET_VIEWER, GET_WRONG_NETWORK } from 'shared/api/graphql/state-cache';
import { Button } from 'shared/ui/button';
import { BurgerButton } from 'entities/burger';
import { useAdaptation } from 'shared/lib/viewportAdaptation';

import { MobileMenu } from '../mobile-menu';

import styles from './styles.module.scss';

export const Header = () => {
  const { t } = useTranslation();
  const { library, account } = useWeb3React();
  const {
    data: { wrongNetwork },
  } = useQuery(GET_WRONG_NETWORK);
  const { data, loading, error } = useQuery(GET_VIEWER);

  const viewportWidth = useAdaptation();

  const [menuOpened, cycleMenu] = useCycle(false, true);

  useEffect(() => {
    if (window.ethereum) {
      const { ethereum, location } = window;

      ethereum.on('chainChanged', () => location.reload());

      return () => {
        ethereum.removeListener('chainChanged', () => location.reload());
      };
    }
  }, []);

  useEffect(() => {
    async function fetchBalance() {
      let balance;

      if (library) balance = await library.eth.getBalance(account);

      viewerVar({ balance });
    }

    if (account) fetchBalance();
  }, [library, account]);

  return (
    <header className={styles.wrapper}>
      <div
        className={classNames('container', styles.container, {
          [styles['menu-opened']]: menuOpened,
        })}
      >
        {viewportWidth < 1024 ? (
          <MobileMenu isOpen={menuOpened} toggleMenu={cycleMenu} />
        ) : null}
        <div className={styles.root}>
          <a href="/" className={`${styles.branding} hide-highlight`}>
            GreedyArt
            <span>{t('branding')}</span>
          </a>
          <div className={styles.nav}>
            <Link to="/token" className={`link ${styles.desktop}`}>
              {t('token.title')}
            </Link>
            <a
              href="https://help.greedyart.io/"
              target="_blank"
              rel="noreferrer"
              className={`link ${styles.desktop}`}
            >
              {t('help.title')}
            </a>
            {account ? (
              <Link to="/create" className={`link ${styles.desktop}`}>
                {t('creating.title')}
              </Link>
            ) : (
              <ConnectWallet>
                <div className={`link ${styles.desktop}`}>
                  {t('creating.title')}
                </div>
              </ConnectWallet>
            )}
            <Viewer address={account} balance={data.viewer.balance}>
              <ConnectWallet>
                <Button
                  type="secondary"
                  label={
                    viewportWidth < 768
                      ? t('connectwallet.connect')
                      : t('connectwallet.title')
                  }
                />
              </ConnectWallet>
              <Logout />
            </Viewer>
            {viewportWidth < 1024 ? (
              <BurgerButton opened={menuOpened} onClick={() => cycleMenu()} />
            ) : null}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {wrongNetwork && (
          <WrongNetworkModal closeModal={() => wrongNetworkState(false)} />
        )}
      </AnimatePresence>
    </header>
  );
};
