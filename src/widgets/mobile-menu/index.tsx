import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useClipboard from 'react-use-clipboard';
import { Cycle } from 'framer-motion';

import { addressFormatter } from 'shared/lib/addressFormatter';
import { ReactComponent as LogoutSvg } from 'shared/assets/icons/logout.svg';
import { LanguageSwitcher } from 'features/switch-language';
import { useAlerts } from 'entities/alert';
import { ConnectWallet } from 'features/auth/connect-wallet';
import { Button } from 'shared/ui/button';

import styles from './mobile-menu.module.scss';

export interface MobileMenuProps {
  isOpen: boolean;
  children?: React.ReactNode;
  toggleMenu: Cycle;
}

export const MobileMenu = ({ isOpen, toggleMenu }: MobileMenuProps) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const [isCopied, setCopied] = useClipboard(account || '', {
    successDuration: 1000,
  });
  const { addAlert } = useAlerts();
  const { deactivate } = useWeb3React();

  const logoutHandler = () => {
    sessionStorage.removeItem('defaultConnector');
    toggleMenu();
    deactivate();
  };

  const onConnectClick = () => {
    toggleMenu();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.maxHeight = '100vh';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.maxHeight = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (isCopied) {
      addAlert({
        type: 'success',
        title: t('connectwallet.copied'),
        offsetTop: '80px',
      });
    }
  }, [isCopied]);

  const activeClass = isOpen
    ? `${styles.mobiledrop} ${styles.active}`
    : `${styles.mobiledrop}`;

  return (
    <div className={styles.root}>
      <div className={activeClass}>
        <div></div>
        <div className={styles.nav}>
          {account ? (
            <div className={styles.wallet}>
              <div className={styles.walletAddress} onClick={setCopied}>
                {addressFormatter(account || '')}
              </div>
              <div className={styles.logout} onClick={logoutHandler}>
                <LogoutSvg />
              </div>
            </div>
          ) : (
            <ConnectWallet>
              <Button
                type="primary"
                label={t('connectwallet.title')}
                className={styles.connectWallet}
                onClick={onConnectClick}
              />
            </ConnectWallet>
          )}
          {account ? (
            <Link to="/selecting">
              <div className={styles.creating}>{t('creating.title')}</div>
            </Link>
          ) : null}
          <div className={styles.list}>
            {account ? (
              <Link to="/my-auctions">{t('myauctions.title')}</Link>
            ) : null}
            <Link to="/token">{t('token.title')}</Link>
            <a
              href="https://help.greedyart.io/"
              target="_blank"
              rel="noreferrer"
            >
              {t('help.title')}
            </a>
          </div>
        </div>
        <LanguageSwitcher className={styles.close} />
      </div>
    </div>
  );
};
