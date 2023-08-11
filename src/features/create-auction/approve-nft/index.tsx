import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { useTranslation } from 'react-i18next';
import { useReactiveVar } from '@apollo/client';

import { useBlockchain } from 'shared/api/blockchain';

import { useException } from 'shared/lib/exceptions';
import { Exception } from 'shared/interfaces/Exception';
import approveIcon from 'shared/assets/icons/done.svg';

import { creatingState } from '../model';

import styles from './styles.module.scss';

export const ApproveNft = () => {
  const { t } = useTranslation();
  const creating = useReactiveVar(creatingState);
  const { account, library } = useWeb3React();
  const blockchain = useBlockchain(library);
  const [loading, setLoading] = useState(false);
  const { exception } = useException();

  useEffect(() => {
    async function approveChecking() {
      try {
        if (account && creating.activeItem) {
          const { address, id } = creating.activeItem;

          const isApproved = await blockchain.checkApproved(
            account,
            address,
            id,
          );

          creatingState({ ...creating, isApproved });
        }
      } catch (e) {
        exception(e as Exception);
      }
    }

    library && approveChecking();
  }, [account, library]);

  const approveHandler = async () => {
    try {
      setLoading(true);

      if (account && creating.activeItem) {
        await blockchain.approveToken(
          account,
          creating.activeItem?.address,
          creating.activeItem.id,
        );

        creatingState({ ...creating, isApproved: true });
      }
    } catch (e) {
      exception(e as Exception);
    } finally {
      setLoading(false);
    }
  };

  if (creating.isApproved)
    return (
      <button className={`${styles.button} ${styles.disabled}`}>
        <img src={approveIcon} alt="icon" /> {t('creating.approved')}
      </button>
    );

  return (
    <>
      {loading ? (
        <button
          className={`${styles.button} ${styles.disabled} ${styles.loading}`}
        >
          <div className={`${styles.loader}`}>Loading...</div>{' '}
          <span>{t('creating.approve')}</span>
        </button>
      ) : (
        <button
          onClick={approveHandler}
          className={`${styles.button}`}
          type={'submit'}
        >
          {t('creating.approve')}
        </button>
      )}
    </>
  );
};
