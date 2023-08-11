import { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { cloneDeep } from 'lodash-es';
import { useWeb3React } from '@web3-react/core';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { Bid } from 'shared/interfaces/Bid';
import { cryptoFormatter } from 'shared/lib/cryptoFormatter';
import { dateFormatter } from 'shared/lib/dateFormatter';

import mobcloser from 'shared/assets/icons/explorer-link.svg';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import { addressFormatter } from 'shared/lib/addressFormatter';

import styles from './styles.module.scss';

export enum BidsTableVariant {
  normal = 'normal',
  bold = 'bold',
}

type propTypes = {
  bids: Bid[];
  limit?: number;
  className?: string;
  variant?: BidsTableVariant;
};

export const BidsTable = ({
  bids,
  limit = Infinity,
  variant = BidsTableVariant.normal,
  className = '',
}: propTypes) => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { account } = useWeb3React();
  const [parent, _] = useAutoAnimate<HTMLUListElement>();
  const slicedBids = useMemo<Bid[]>(() => {
    const stateLimit = isExpanded ? Infinity : limit;
    const bidsToShow = cloneDeep(bids);
    bidsToShow.reverse();

    return bidsToShow.slice(0, stateLimit);
  }, [bids, isExpanded, limit]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <ul
        ref={parent}
        className={`${styles.list} ${className} ${styles[variant]}`}
      >
        <li>
          <div className={styles.wrapper}>
            <span>{t('auctions.bet_day')}</span>
            <span className={styles.betAmount}>{t('auctions.bet')}</span>
            <span>{t('auctions.bet_wallet')}</span>
          </div>
        </li>
        {!bids.length ? (
          <div className={styles.noBets}>No bets yet</div>
        ) : (
          slicedBids.map((e) => (
            <li key={e.date}>
              <div className={styles.wrapper}>
                <span>{dateFormatter(e.date * 1000)}</span>
                <div className={styles.amount}>
                  {viewportWidth < 768 && <label>Bet</label>}
                  <span className={styles['bid-amount']}>
                    {e.bidder.toLowerCase() === account?.toLowerCase() && (
                      <span className={styles.badge}>YOU</span>
                    )}
                    {cryptoFormatter(e.bidPrice)} BNB
                  </span>
                </div>
                {viewportWidth > 767 && (
                  <div className={styles.amount}>
                    <a
                      href={
                        import.meta.env.VITE_CHAIN_SCAN_URI +
                        `/tx/` +
                        e.transactionHash
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={mobcloser} alt="" />
                      {`${addressFormatter(e.bidder, 6)}`}
                    </a>
                  </div>
                )}
              </div>
              {viewportWidth < 768 && (
                <div className={styles.amount}>
                  <label>{t('auctions.bet_wallet')}</label>
                  <a
                    href={
                      import.meta.env.VITE_CHAIN_SCAN_URI +
                      `/tx/` +
                      e.transactionHash
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={mobcloser} alt="" />
                    {`${addressFormatter(e.bidder)}`}
                  </a>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
      {bids.length > limit && !isExpanded && limit !== Infinity && (
        <div className={styles.buttonContainer}>
          <button onClick={toggleExpand} className={styles.bidsHistoryButton}>
            {t('auctions.load_more')}
          </button>
        </div>
      )}
    </div>
  );
};
