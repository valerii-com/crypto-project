import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import utils from 'web3-utils';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';

import { useAlerts } from 'entities/alert';
import { useBlockchain } from 'shared/api/blockchain';
import { Exception } from 'shared/interfaces/Exception';
import { useException } from 'shared/lib/exceptions';
import { Modal } from 'shared/ui/modal';
import { Button } from 'shared/ui/button';
import { AUCTION_STATUS } from 'shared/constants';

import styles from './styles.module.scss';

type propTypes = {
  id: number;
  status?: number;
  setStatus?: (status: number) => void;
};

export const ProcessMyAuction = ({ id, status, setStatus }: propTypes) => {
  const STATUS_TO_UPDATE_METADATA = [
    AUCTION_STATUS.ACTIVATED,
    AUCTION_STATUS.AWAITING,
    AUCTION_STATUS.IN_PROGRESS,
  ];
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState('');
  const { account, library } = useWeb3React();
  const blockchain = useBlockchain(library);
  const { addAlert } = useAlerts();
  const { exception } = useException();
  const [metadataUpdating, setMetadataUpdating] = useState(false);

  useEffect(() => {
    status === 3 &&
      (async () => {
        const { toSeller } = await blockchain.countReward(id);

        setAmount(utils.fromWei(toSeller, 'ether'));
      })();
  }, [blockchain, id, status]);

  const updateAuctionMetadata = async () => {
    setMetadataUpdating(true);
    const result = await axios.get(
      `${import.meta.env.VITE_SERVER_URI}/auctions/update-meta`,
      {
        params: {
          auctionId: id,
        },
      },
    );
    if (result.data && result.data.isUpdated) {
      addAlert({
        type: 'success',
        title: t('myauctions.meta_updated'),
        message: t('myauctions.meta_updated_text'),
      });
    } else {
      addAlert({
        type: 'error',
        title: t(''),
      });
    }
    setMetadataUpdating(false);
  };

  const processAuction = async () => {
    setLoading(true);

    try {
      if (status && status < 4) {
        await blockchain.close(account!, id);

        setStatus && setStatus(4);

        addAlert({
          type: 'success',
          title: t('auctions.closed'),
          message: t('auctions.closed_msg'),
        });
      } else {
        await blockchain.cancel(account!, id);

        setStatus && setStatus(5);

        addAlert({
          type: 'success',
          title: t('auctions.cancelled'),
          message: t('auctions.cancelled_msg'),
        });
      }
    } catch (e) {
      exception(e as Exception);
    }

    setLoading(false);
    setShowConfirmation(false);
  };

  return (
    <>
      <div className={styles.root}>
        {typeof status === 'number' &&
          STATUS_TO_UPDATE_METADATA.includes(Number(status)) && (
            <button
              className={`link ${styles.linkButton}`}
              onClick={() => updateAuctionMetadata()}
            >
              {metadataUpdating ? (
                <>
                  <div className={`${styles.loader}`}>Loading...</div>
                </>
              ) : (
                t('myauctions.update-meta')
              )}
            </button>
          )}
        {(status === 0 || status === 3) && (
          <button
            className={`link ${styles.linkButton}`}
            onClick={() => setShowConfirmation(true)}
          >
            {status === 0 && t('auctions.cancel')}
            {status === 3 && t('auctions.close')}
          </button>
        )}
        {status === 5 ? (
          <span className={`link disabled ${styles.linkButton}`}>
            {t('myauctions.view')}
          </span>
        ) : (
          <Link
            to={`/auction?id=${id}`}
            className={`link ${styles.linkButton}`}
          >
            {t('myauctions.view')}
          </Link>
        )}
      </div>
      <AnimatePresence>
        {showConfirmation && (
          <Modal closeModal={() => setShowConfirmation(false)}>
            <div className={styles.modal}>
              <h3>
                {status === 0 && t('myauctions.remove')}
                {status === 3 && t('myauctions.claim')}
              </h3>

              <p>
                {status === 0 && t('myauctions.remove_msg')}
                {status === 3 && t('bidding.claim_msg', { amount })}
              </p>

              <div onClick={processAuction}>
                {loading ? (
                  <Button />
                ) : (
                  <Button
                    label={
                      status === 0 ? t('auctions.cancel') : t('auctions.close')
                    }
                  />
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};
