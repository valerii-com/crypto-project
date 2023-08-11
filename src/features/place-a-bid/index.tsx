import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import utils from 'web3-utils';
import { AnimatePresence } from 'framer-motion';

import { useAlerts } from 'entities/alert';
import { timeFormatter } from 'shared/lib/timeFormatter';
import { useException } from 'shared/lib/exceptions';
import { cryptoFormatter } from 'shared/lib/cryptoFormatter';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import { useBlockchain } from 'shared/api/blockchain';
import { Button } from 'shared/ui/button';
import { AmountInput } from 'shared/ui/amount-input';
import { Exception } from 'shared/interfaces/Exception';
import { Auction } from 'shared/interfaces/Auction';

import { AttentionMessage } from './attention';
import { Submit } from './submit-btn';
import styles from './styles.module.scss';

type propTypes = {
  auction: Auction;
  children: React.ReactChild;
};

export const BidPlacing = ({ auction, children }: propTypes) => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const { account, library } = useWeb3React();
  const blockchain = useBlockchain(library);
  const [value, setValue] = useState(0.001);
  const [loading, setLoading] = useState(false);
  const [attention, setAttention] = useState(false);
  const { addAlert } = useAlerts();
  const { exception } = useException();

  const currentBid = auction.bids[auction.bids.length - 1];
  const previousBid = auction.bids[auction.bids.length - 2];

  const minBid = currentBid
    ? parseFloat(utils.fromWei(currentBid.minNext, 'ether'))
    : 0.001;

  useEffect(() => {
    if (currentBid && currentBid.bidder === account) {
      currentBid.transactionHash &&
        addAlert({
          type: 'success',
          title: t('bidding.accepted', {
            amount: `${cryptoFormatter(currentBid.bidPrice)} BNB`,
          }),
          link: {
            label: t('bidding.bsc'),
            href: `${import.meta.env.VITE_CHAIN_SCAN_URI}/tx/${
              currentBid.transactionHash
            }`,
          },
        });

      setLoading(false);
    }

    if (previousBid && previousBid.bidder === account)
      currentBid.transactionHash &&
        addAlert({
          type: 'info',
          title: t('bidding.newbet', {
            amount: `${cryptoFormatter(currentBid.bidPrice)} BNB`,
          }),
          message: t('bidding.outbid'),
        });
  }, [account, currentBid, previousBid, addAlert, t]);
  useEffect(() => setValue(minBid), [minBid]);

  const submitHandler = async (event: React.SyntheticEvent) => {
    event && event.preventDefault();

    const agreedWallets: string[] = JSON.parse(
      localStorage.getItem('isAttentionAgreed') || '[]',
    );

    if (agreedWallets.some((wallet) => wallet === account)) {
      setLoading(true);

      if (value && account) {
        try {
          await blockchain.placeNewBid(account, auction.ID, value);
        } catch (e) {
          exception(e as Exception);
        }
      }

      setLoading(false);
    } else {
      setAttention(true);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler} className={styles.root}>
        <div className={styles.inner}>
          <div>
            <label>{t('bidding.bet')}</label>
            <AmountInput minBid={minBid} value={value} setValue={setValue} />
          </div>
          <div className={styles.bettime}>
            <label>{t('bidding.bet_time')}</label>
            <div className={styles.bidtime}>
              {timeFormatter((auction.timeframe - auction.bids.length) * 1000)}
            </div>
          </div>
          {viewportWidth < 1024 &&
            (account ? (
              loading ? (
                <Button />
              ) : (
                <Submit auction={auction} />
              )
            ) : (
              children
            ))}
        </div>
        {viewportWidth > 1023 &&
          (account ? (
            loading ? (
              <Button />
            ) : (
              <Submit auction={auction} />
            )
          ) : (
            children
          ))}
      </form>
      <AnimatePresence>
        {attention && (
          <div className={styles.attention}>
            <AttentionMessage
              handleNewBid={submitHandler}
              modalSetter={setAttention}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
