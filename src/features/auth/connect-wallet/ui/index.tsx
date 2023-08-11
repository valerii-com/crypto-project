import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';

import { wrongNetworkState } from 'features/auth/wrong-network';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import { Modal } from 'shared/ui/modal';
import { Button } from 'shared/ui/button';
import metamask from 'shared/assets/icons/metamask.svg';
import walletconnecticon from 'shared/assets/icons/walletconnect.svg';

import { injected, walletconnect } from '../lib/connectors';

import styles from './styles.module.scss';

const CHAIN_ID = import.meta.env.VITE_CHAIN_ID;

type propTypes = {
  children: React.ReactNode;
};

const isMetamask =
  new URL(document.location.href).searchParams.get('m') !== null;

export const ConnectWallet = ({ children }: propTypes) => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const { activate, chainId } = useWeb3React();
  const [isOpen, setIsOpen] = useState(isMetamask);
  const { networkVersion } = window.ethereum || { networkVersion: null };

  useEffect(() => {
    async function autoConnection() {
      if (networkVersion && networkVersion !== CHAIN_ID) return null;

      const connector = sessionStorage.getItem('defaultConnector');

      if (connector === 'InjectedConnector') {
        await activate(injected);
      } else if (connector === 'WalletConnectConnector') {
        await activate(walletconnect);
      }
    }

    autoConnection();
  }, [activate, networkVersion, chainId]);

  const connectionHandler = async (provider: any) => {
    sessionStorage.setItem('defaultConnector', provider);

    switch (provider) {
      case 'InjectedConnector':
        await activate(injected);
        break;
      case 'WalletConnectConnector':
        await activate(walletconnect, (error) => console.log(error));
        break;
    }

    if (networkVersion && networkVersion !== CHAIN_ID) {
      setIsOpen(false);

      return wrongNetworkState(true);
    }
  };

  const btnType = viewportWidth < 767 ? 'primary' : 'secondary';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Modal closeModal={() => setIsOpen(false)}>
            <h3> {t('connectwallet.title')}</h3>
            <div className={styles.connectors}>
              <div className={styles.connector}>
                <div>
                  <img src={metamask} alt="" />
                  <b>MetaMask</b>
                </div>
                {window.ethereum && window.ethereum.isMetaMask ? (
                  <div onClick={() => connectionHandler('InjectedConnector')}>
                    <Button type={btnType} label={t('connectwallet.connect')} />
                  </div>
                ) : (
                  <a
                    href="https://metamask.app.link/dapp/stage.greedyart.io/?m"
                    target={'_blank'}
                    rel="noreferrer"
                  >
                    <Button type={btnType} label={t('connectwallet.connect')} />
                  </a>
                )}
              </div>
              <div className={styles.connector}>
                <div>
                  <img src={walletconnecticon} alt="" />
                  <b>Walletconnect</b>
                </div>
                <div
                  onClick={() => connectionHandler('WalletConnectConnector')}
                >
                  <Button type={btnType} label={t('connectwallet.connect')} />
                </div>
              </div>
            </div>
            <p className={styles.pstext}>
              {t('connectwallet.wallets')}
              <a
                href="https://walletconnect.com/registry/wallets"
                target="_blank"
                rel="noreferrer"
              >
                {t('connectwallet.wallets_link')}
              </a>
            </p>
          </Modal>
        )}
      </AnimatePresence>

      <div onClick={() => setIsOpen(true)}>{children}</div>
    </>
  );
};
