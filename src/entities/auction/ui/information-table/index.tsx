/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useWeb3React } from '@web3-react/core';
import utils from 'web3-utils';

import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { addressFormatter } from 'shared/lib/addressFormatter';

import { Auction } from 'shared/interfaces/Auction';

import { getPoolAmount } from 'shared/lib/getPoolAmount';

import { coinPriceFetcher } from '../winner-award/lib';

import { BidsHistory } from './BidsHistory';
import styles from './styles.module.scss';

type propTypes = { auction: Auction };

export const InformationTable = ({ auction }: propTypes) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { status, bids, reward, initialPrice } = auction;
  const currentBid = bids && bids[bids?.length - 1];
  const isCompleted = status > 2;
  const [convertedAward, setConvertedAward] = useState('');

  useEffect(() => {
    async function fetchUSD() {
      const usd: Promise<number> = await coinPriceFetcher();

      const converted =
        (await usd) * parseFloat(utils.fromWei(reward, 'ether'));

      setConvertedAward(converted.toFixed(2));
    }

    isCompleted && fetchUSD();
  }, [reward, isCompleted]);

  return (
    <div className={styles.root}>
      <div className={styles.item}>
        <span>{t('auctions.poolamount')}</span>
        <b>{currentBid ? getPoolAmount(bids, initialPrice) : 0} BNB</b>
      </div>
      <div className={styles.item}>
        <span>
          {isCompleted ? t('auctions.finalbid') : t('auctions.currentbid')}
        </span>
        <b>
          {currentBid
            ? `${utils.fromWei(currentBid.bidPrice, 'ether')} `
            : '0 '}
          BNB
        </b>
      </div>
      {isCompleted && (
        <div className={styles.item}>
          <span>{t('auctions.bidderaward')}</span>
          <b>
            {utils.fromWei(reward, 'ether')} BNB / {convertedAward} $
          </b>
        </div>
      )}
      <div className={styles.item}>
        <span>{t('auctions.bets')}</span>
        <div>
          <b>{bids?.length || 0}</b>
          {bids && bids.length ? <BidsHistory bids={bids} /> : <></>}
        </div>
      </div>
      <div className={styles.item}>
        <span>
          {isCompleted ? t('completed.bidderwallet') : t('auctions.bidder')}
          {currentBid &&
            account === currentBid?.bidder &&
            ` (${t('auctions.you')})`}
        </span>
        <b>
          {currentBid
            ? addressFormatter(currentBid.bidder, 16)
            : t('auctions.notstarted')}
        </b>
      </div>
    </div>
  );
};
