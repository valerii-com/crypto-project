import { lazy, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import { Link, useNavigate } from 'react-router-dom';

import { useWeb3React } from '@web3-react/core';

import { Layout } from 'shared/ui/layout';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { ConnectWallet } from 'features/auth/connect-wallet';
import { BidPlacing } from 'features/place-a-bid';
import { CompletionTimer } from 'features/completion-timer';
import { WelcomeLogo } from 'entities/auction/ui/welcome';
import { WinnerClaiming } from 'features/winner-claiming';

import {
  Heading,
  TokenPreview,
  MobileBidding,
  InformationTable,
  UpcomingAuctions,
  HowItWorks,
} from 'entities/auction';
import { Auction } from 'shared/interfaces/Auction';
import { Button } from 'shared/ui/button';
import { Animated } from 'shared/ui/animated';
import { Splitted } from 'shared/ui/splitted';
import { AccentBlock } from 'shared/ui/accent-block';
import { timeFormatter } from 'shared/lib/timeFormatter';
import { GetAuctionData, GET_AUCTION } from 'shared/api/graphql/queries';
import { client, globalLoading } from 'app/providers/with-apollo';

import styles from './styles.module.scss';
import { blockchainSubscription, socketSubscription } from './model';

const ServerErrorPage = lazy(() => import('../server-error'));
interface LandingPageProps {
  currentId: number;
}

const LandingPage = ({ currentId }: LandingPageProps) => {
  const [nextAuction, setNextAuction] = useState<number>();
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const [auction, setAuction] = useState<Auction>();
  const id = currentId;

  const { data, error } = useQuery<GetAuctionData>(GET_AUCTION, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    skip: !id,
    onCompleted: (data) => {
      globalLoading(false);
    },
  });

  useEffect(() => {
    if (data) {
      setAuction(data.auctionByID);
    }
  }, [data]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (auction) {
      const { status } = auction;

      if (status && status < 3) {
        const contact = blockchainSubscription(id, setAuction);
        const socket = socketSubscription(setNextAuction);

        return () => {
          contact.unsubscribe();
          socket.disconnect();
        };
      }
    }
  }, [id]);

  // useEffect(() => {
  //   if (account && auction) {
  //     const { status } = auction;
  //     if (status === 3 || status === 4) {
  //       if (
  //         auction.bids.findIndex(
  //           (bid) => bid.bidder.toLowerCase() === account?.toLowerCase(),
  //         ) === -1
  //       )
  //         client.refetchQueries({ include: 'active' });
  //       else {
  //         navigate(`/auction?id=${id}`);
  //       }
  //     }
  //   }
  // }, [auction, account, id, navigate]);

  if (error) return <ServerErrorPage />;

  if (!auction) return <></>;

  const { status, ID, bids } = auction;

  return (
    <Layout>
      <Header />
      <section className={`container ` + styles.wrapper}>
        <WelcomeLogo />
        <HowItWorks />
      </section>
      <section className={styles.auctionWrapper} id="auction">
        <div className="container">
          <div className={styles.auctionHeader}>
            <h2 className={styles.auctionTitle}>
              {t('connectwallet.sectionTitle')}
            </h2>
            <Link to={`/auction`}>
              <div className={styles.goToAuction}>
                {isMobile ? 'Go' : t('connectwallet.goToAuction')}
                <svg
                  width="12"
                  height="21"
                  viewBox="0 0 12 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.57869 0.947638C3.0066 0.350787 2.10882 0.350788 1.53673 0.947639L0.528331 1.99968C-0.0865068 2.64113 -0.086505 3.71715 0.528333 4.3586L6.38134 10.4649L0.461128 16.6414C-0.15371 17.2829 -0.153709 18.3589 0.461129 19.0003L1.46953 20.0524C2.04162 20.6492 2.93939 20.6492 3.51148 20.0524L11.4717 11.7476C11.6062 11.6073 11.7113 11.4461 11.787 11.2732C12.1379 10.6363 12.0552 9.79106 11.5389 9.25236L3.57869 0.947638Z"
                    fill="#7460FF"
                  />
                </svg>
              </div>
            </Link>
          </div>
          <Splitted>
            <TokenPreview token={auction.token} />
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

              <div className={`${styles.bidding} hide-highlight`}>
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
        <UpcomingAuctions />
      </section>
      <Footer isAuctionPage />
    </Layout>
  );
};

export default LandingPage;
