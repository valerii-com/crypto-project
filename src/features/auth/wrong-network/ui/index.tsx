import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import { Exception } from 'sass';
import MetamaskService from 'shared/api/metamask';
import { CHAINS, CHAINS_EXTENDED } from 'shared/api/metamask/chains';

import { Button } from 'shared/ui/button';
import { Modal } from 'shared/ui/modal';
// import MetamaskService from 'shared/api/metamask';

import styles from './styles.module.scss';

type propTypes = { closeModal: () => void };

export const WrongNetworkModal = ({ closeModal }: propTypes) => {
  const { t } = useTranslation();
  const { deactivate, library, activate } = useWeb3React();
  // const chainId =

  const signOutHandler = () => {
    sessionStorage.removeItem('defaultConnector');
    deactivate();
    closeModal();
  };

  const changeNetworkHandler = () => {
    MetamaskService.requestNetworkChange(library.currentProvider);
  };

  return (
    <Modal>
      <div className={styles.root}>
        <div className={styles.loader}>Loading...</div>
        <h3>{t('network.wrong')}</h3>
        <p>{t('network.wrong_msg')}</p>
        <div className={styles.buttons}>
          <Button
            className={styles.button}
            onClick={signOutHandler}
            type="secondary"
            label={t('network.singout')}
          />
          <Button
            className={styles.button}
            onClick={changeNetworkHandler}
            type="primary"
            label={t('network.change')}
          />
        </div>
      </div>
    </Modal>
  );
};
