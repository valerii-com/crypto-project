import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';

import { useAlerts } from 'entities/alert';
import { useBlockchain } from 'shared/api/blockchain';
import { Exception } from 'shared/interfaces/Exception';
import { useException } from 'shared/lib/exceptions';
import { Alert } from 'shared/ui/alert';
import { Button } from 'shared/ui/button';
import { Loader } from 'shared/ui/loader';

import styles from './styles.module.scss';
type propTypes = { id: number; winner: string };

export const WinnerClaiming = ({ id, winner }: propTypes) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { account, library } = useWeb3React();
  const blockchain = useBlockchain(library);
  const { addAlert } = useAlerts();
  const { exception } = useException();

  const claimReward = async () => {
    setLoading(true);

    try {
      if (!account) {
        addAlert({
          type: 'error',
          title: t('errors.title'),
          message: t('errors.account_not_found'),
        });

        return;
      }
      await blockchain.close(account, id);

      setSuccess(true);

      addAlert({
        type: 'success',
        title: t('auctions.closed'),
        message: t('auctions.closed_msg'),
      });
    } catch (e) {
      exception(e as Exception);
    }

    setLoading(false);
  };

  if (account !== winner || success) return null;

  return (
    <div className={styles.root}>
      <Alert
        type="success"
        title={t('completed.winner')}
        message={t('completed.winner_msg')}
        className={styles.alert}
      >
        {loading ? (
          <Button className={styles.claimButton} />
        ) : (
          <Button
            className={styles.claimButton}
            isDisabled={loading}
            onClick={claimReward}
            label={loading ? <Loader /> : t('auctions.close')}
          />
        )}
      </Alert>
    </div>
  );
};
