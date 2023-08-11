import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { io } from 'socket.io-client';
import { useWeb3React } from '@web3-react/core';
import { AnimatePresence, motion } from 'framer-motion';

import { useBlockchain } from 'shared/api/blockchain';
import { GET_CREATING } from 'shared/api/graphql/state-cache';
import { useException } from 'shared/lib/exceptions';
import { Loader } from 'shared/ui/loader';
import { Button } from 'shared/ui/button';
import { Modal } from 'shared/ui/modal';
import { Exception } from 'shared/interfaces/Exception';
import success from 'shared/assets/icons/success.svg';

import { CreatingState } from 'shared/interfaces/CreatingState';

import { creatingState } from '../model';

import styles from './styles.module.scss';
import { LocalLoader } from 'shared/ui/local-loader';

type propTypes = { initialReward: number };

export const TransferNft = ({ initialReward }: propTypes) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useQuery<{ creating: CreatingState }>(GET_CREATING);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { account, library } = useWeb3React();
  const blockchain = useBlockchain(library);
  const { exception } = useException();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URI || '');

    socket.on('auctionCreated', (data) => {
      if (data.initiator === account) {
        setConfirmed(data.id);
        setLoading(false);
        creatingState({});
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [account]);

  const clickHandler = async () => {
    try {
      setLoading(true);

      if (data && data.creating.activeItem) {
        const { amount, address, id } = data.creating.activeItem;

        const tokenAmount = amount || (data.creating.erc === 1155 && 1);

        await blockchain.createNewAuction(
          account!,
          initialReward,
          { address, id },
          tokenAmount,
        );
      }
    } catch (e) {
      exception(e as Exception);

      setLoading(false);
    }
  };

  if (data)
    return (
      <div>
        {data.creating.isApproved ? (
          <div onClick={clickHandler}>
            <Button label={t('creating.title')} />
          </div>
        ) : (
          <Button label={t('creating.title')} isDisabled />
        )}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LocalLoader />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {confirmed && (
            <Modal closeModal={() => navigate(`/auction?id=${confirmed}`)}>
              <div className={styles.success}>
                <img src={success} alt="success" />
                <h3>{t('creating.success')}</h3>
                <p>{t('creating.success_msg')}</p>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    );

  return null;
};
