import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import utils from 'web3-utils';
import { AnimatePresence } from 'framer-motion';

import { useAlerts } from 'entities/alert';
import { useBlockchain } from 'shared/api/blockchain';
import { Exception } from 'shared/interfaces/Exception';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import { useException } from 'shared/lib/exceptions';
import { Modal } from 'shared/ui/modal';
import { Button } from 'shared/ui/button';

import styles from './styles.module.scss';

type propTypes = {
  id: number;
  _status?: number;
  isWinner?: boolean;
};

export const ProcessCompleted = ({ id, _status, isWinner }: propTypes) => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState(_status);
  const [loading, setLoading] = useState(false);
  const { account, library } = useWeb3React();
  const blockchain = useBlockchain(library);
  const { addAlert } = useAlerts();
  const { exception } = useException();

  useEffect(() => {
    (async () => {
      const { toSeller, winnerReward } = await blockchain.countReward(id);

      setAmount(utils.fromWei(isWinner ? winnerReward : toSeller, 'ether'));
    })();
  }, [blockchain, id, status, isWinner]);

  const closeAuction = async () => {
    setLoading(true);

    try {
      await blockchain.close(account!, id);

      setStatus(4);

      addAlert({
        type: 'success',
        title: t('auctions.closed'),
        message: t('auctions.closed_msg'),
      });
    } catch (e) {
      exception(e as Exception);
    }

    setLoading(false);
    setShowConfirmation(false);
  };

  return (
    <>
      {status === 3 &&
        (viewportWidth > 1023 ? (
          <button className="link" onClick={() => setShowConfirmation(true)}>
            {t('auctions.close')}
          </button>
        ) : (
          <div onClick={() => setShowConfirmation(true)}>
            <Button label={t('auctions.close')} />
          </div>
        ))}
      <AnimatePresence>
        {showConfirmation && (
          <Modal closeModal={() => setShowConfirmation(false)}>
            <div className={styles.root}>
              <h3>{isWinner ? t('completed.claim') : t('myauctions.claim')}</h3>

              <p>
                {isWinner
                  ? t('completed.bidder', { amount })
                  : t('completed.seller', { amount })}
              </p>

              <div onClick={closeAuction}>
                {loading ? <Button /> : <Button label={t('auctions.close')} />}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};
