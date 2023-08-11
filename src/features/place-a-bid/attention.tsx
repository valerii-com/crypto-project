import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';

import { Button } from 'shared/ui/button';
import { Modal } from 'shared/ui/modal';

import styles from './styles.module.scss';

type propTypes = {
  modalSetter: any;
  handleNewBid: any;
};

export const AttentionMessage = ({ modalSetter, handleNewBid }: propTypes) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const agreeHandler = () => {
    const agreedWallets: string[] = JSON.parse(
      localStorage.getItem('isAttentionAgreed') || '[]',
    );

    localStorage.setItem(
      'isAttentionAgreed',
      JSON.stringify([...agreedWallets, account]),
    );

    modalSetter(false);
    handleNewBid();
  };

  return (
    <Modal closeModal={() => modalSetter(false)}>
      <div className={styles.attention}>
        <h3>{t('attention.title')}</h3>
        <p>{t('attention.description')}</p>
        <div className={styles.buttons}>
          <Button
            type="secondary"
            label={t('attention.reject')}
            onClick={() => modalSetter(false)}
          />
          <Button onClick={agreeHandler} label={t('attention.agree')} />
        </div>
      </div>
    </Modal>
  );
};
