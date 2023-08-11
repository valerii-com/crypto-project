import { ReactChild, useEffect, useRef, useState } from 'react';
import utils from 'web3-utils';

import { useTranslation } from 'react-i18next';

import { Auction } from 'shared/interfaces/Auction';
import { useOnClickOutside } from 'shared/lib/useOnClickOutSide';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import mobcloser from 'shared/assets/icons/mob-cross.svg';

import styles from './styles.module.scss';

type propTypes = { auction: Auction; children: ReactChild[] };

export const MobileBidding = ({ auction, children }: propTypes) => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const [showFeature, setShowFeature] = useState(false);
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  useOnClickOutside(ref, () => setShowFeature(false));
  const didMount = useRef(false);
  const [restartedTimer, setRestartedTimer] = useState(false);

  const endIn = auction.bids[auction.bids.length - 1]?.endIn;

  const { bids, status } = auction;

  const newestBid = bids[bids.length - 1];

  const minBid = newestBid
    ? parseFloat(utils.fromWei(bids[bids.length - 1].minNext, 'ether'))
    : 0.001;

  const toggleClass = showFeature ? styles.featured : '';

  useEffect(() => {
    if (didMount.current) {
      setRestartedTimer(true);
      setTimeout(() => setRestartedTimer(false), 1000);
    } else {
      didMount.current = true;
    }
  }, [endIn]);

  if (viewportWidth < 1024) {
    return (
      <div
        className={`${styles.root} ${
          restartedTimer ? styles.revert : ''
        } ${toggleClass}`}
        ref={ref}
      >
        <div className={styles.inner}>
          {status > 2 ? (
            <>
              <div className={styles.reward}>
                {children[0]}
                <div className={styles.amount}>
                  <span>{t('completed.bidderreward')}</span>
                  <b>{utils.fromWei(auction.reward)} BNB</b>
                </div>
              </div>
              <div
                className={styles.completed}
                style={status > 2 ? { display: 'none' } : {}}
              >
                {children[0]}
              </div>
            </>
          ) : (
            <>
              <div className={styles.info}>
                <div>{children[0]}</div>
              </div>
              {showFeature ? (
                <div ref={ref}>
                  {children[1]}
                  <div
                    className={styles.close}
                    onClick={() => setShowFeature(false)}
                  >
                    <img src={mobcloser} alt="" />
                  </div>
                </div>
              ) : (
                status > 0 &&
                status < 3 && (
                  <button
                    onClick={() => setShowFeature(true)}
                    className={styles.button}
                  >
                    <b>{t('bidding.placing')}</b> ({t('bidding.min')} {minBid}
                    BNB)
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};
