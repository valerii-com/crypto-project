import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Link, useNavigate } from 'react-router-dom';

import { useWeb3React } from '@web3-react/core';

import { Layout } from 'shared/ui/layout';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { ConnectWallet } from 'features/auth/connect-wallet';
import { BidPlacing } from 'features/place-a-bid';
import { CompletionTimer } from 'features/completion-timer';
import { WinnerClaiming } from 'features/winner-claiming';

import {
  Heading,
  TokenPreview,
  MobileBidding,
  InformationTable,
} from 'entities/auction';
import { Auction } from 'shared/interfaces/Auction';
import { Button } from 'shared/ui/button';
import { Animated } from 'shared/ui/animated';
import { Splitted } from 'shared/ui/splitted';

import { AccentBlock } from 'shared/ui/accent-block';
import { timeFormatter } from 'shared/lib/timeFormatter';
import BackArrow from 'entities/auction/ui/back-arrow';
import { BidsTable } from 'entities/auction/ui/information-table/BidsTable';
import { AUCTION_STATUS } from 'shared/constants';
import { client } from 'app/providers/with-apollo';

import styles from './styles.module.scss';
import { blockchainSubscription, socketSubscription } from './model';

interface ActiveAuctionProps {
  auction: Auction;
  setAuction: Dispatch<SetStateAction<Auction | undefined>>;
}

export const ActiveAuction = ({ auction, setAuction }: ActiveAuctionProps) => {
  const { status, bids, ID } = auction;
  const [nextAuction, setNextAuction] = useState<number>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const id = auction.ID;

  const { account } = useWeb3React();

  useEffect(() => {
    const { status } = auction;
    if (status && status < AUCTION_STATUS.ENDED) {
      const contact = blockchainSubscription(ID, setAuction);
      const socket = socketSubscription(setNextAuction);

      return () => {
        contact.unsubscribe();
        socket.disconnect();
      };
    }
  }, [auction, id, setAuction, ID]);

  return (
    <Layout>
      <Header />
      <section className={styles.auctionWrapper} id="auction">
        <div className="container">
          <div className={styles.nav}>
            <Link to="/">
              <BackArrow
                title={t('connectwallet.sectionTitle')}
                subtitle={t('upcomings.back-one')}
              />
            </Link>
          </div>
          <Splitted>
            <TokenPreview token={auction.token} />
            <div className={styles.bidsHistory}>
              <div className={styles.inner}>
                <div className={styles.heading}>
                  <div className={styles.accents}>
                    <Heading auction={auction} nextAuction={nextAuction}>
                      <CompletionTimer
                        endIn={auction.bids[auction.bids.length - 1]?.endIn}
                        setAuction={setAuction}
                      />
                    </Heading>
                  </div>
                </div>
                <InformationTable auction={auction} />
                <div className={styles.bidding}>
                  {status && status < 3 ? (
                    <BidPlacing auction={auction}>
                      <ConnectWallet>
                        <Button label={t('connectwallet.title')} />
                      </ConnectWallet>
                    </BidPlacing>
                  ) : null}
                </div>
                <Animated show={status === 3}>
                  {status === 3 ? (
                    <WinnerClaiming
                      id={ID}
                      winner={bids[bids.length - 1].bidder}
                    />
                  ) : (
                    <></>
                  )}
                </Animated>
              </div>
              <div className={styles.bidsTable}>
                <h3 className={styles.bidsHeader}>
                  {t('auctions.bets_history')}
                </h3>
                <BidsTable
                  bids={auction.bids}
                  limit={5}
                  className={styles.bidsList}
                />
              </div>
            </div>
          </Splitted>
        </div>
      </section>
      <section className={`container ` + styles.wrapper}>
        <MobileBidding auction={auction}>
          <>
            <Heading auction={auction} nextAuction={nextAuction}>
              <CompletionTimer
                endIn={auction.bids[auction.bids.length - 1]?.endIn}
                setAuction={setAuction}
              />
            </Heading>
            <AccentBlock
              param={'Next bet time'}
              value={timeFormatter(
                (auction.timeframe - auction.bids.length) * 1000,
              )}
            />
          </>
          <BidPlacing auction={auction}>
            <ConnectWallet>
              <Button label={t('connectwallet.title')} />
            </ConnectWallet>
          </BidPlacing>
        </MobileBidding>
      </section>
      <Footer isAuctionPage />
    </Layout>
  );
};
