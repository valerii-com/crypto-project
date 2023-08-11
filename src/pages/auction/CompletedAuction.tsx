import { lazy, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QueryResult, useQuery } from '@apollo/client';

import { Header } from 'widgets/header';

import { Footer } from 'widgets/footer';
import { TokenPreview, InformationTable } from 'entities/auction';
import { GET_AUCTION } from 'shared/api/graphql/queries';
import { Loader } from 'shared/ui/loader';
import { Button } from 'shared/ui/button';
import { Layout } from 'shared/ui/layout';
import { Animated } from 'shared/ui/animated';
import { Splitted } from 'shared/ui/splitted';
import { Auction } from 'shared/interfaces/Auction';
import { globalLoading } from 'app/providers/with-apollo';
import { WinnerClaiming } from 'features/winner-claiming';
import BackArrow from 'entities/auction/ui/back-arrow';
import { CompletedBlock } from 'entities/auction/ui/heading';
import { AUCTION_STATUS, ROUTES } from 'shared/constants';

import styles from './styles.module.scss';
import { getAuctionID } from './lib';

type propTypes = { currentId: number | undefined };

const ServerErrorPage = lazy(() => import('../server-error'));

export const CompletedAuction = ({ currentId }: propTypes) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<Auction>();
  const id = currentId || getAuctionID();

  const { data, error } = useQuery(GET_AUCTION, {
    variables: { id },
    fetchPolicy: 'no-cache',
    skip: !id,
    onCompleted: (data) => {
      globalLoading(false);
    },
  });

  useEffect(() => {
    if (data) {
      setAuction(data.auctionByID);
    }
  }, [id, data]);

  const goBack = () => {
    if (history.state && history.state.usr) navigate(-1);
    else navigate(ROUTES.COMPLETED);
  };

  if (error) return <ServerErrorPage />;
  // if (loading) return <Loader />;
  if (auction) {
    const { status, bids, ID } = auction;

    return (
      <Layout>
        <Header />
        <section className={styles.auctionWrapper} id="auction">
          <div className="container">
            <BackArrow
              title={t('completed.title-one')}
              subtitle={t('completed.back-one')}
              onClick={goBack}
            />
            <div className={styles.auctionHeader}></div>
            <Splitted>
              <TokenPreview token={auction.token} />
              <div className={styles.inner}>
                <div className={styles.heading}>
                  <div className={styles.accents}>
                    <CompletedBlock />
                  </div>
                </div>
                <InformationTable auction={auction} />
                <Animated show={status === AUCTION_STATUS.ENDED}>
                  {status === AUCTION_STATUS.ENDED ? (
                    <div>
                      <WinnerClaiming
                        id={ID}
                        winner={bids[bids.length - 1].bidder}
                      />
                      <Link to="/auction">
                        <Button
                          className={styles.nextAuc}
                          label={t('auctions.gonextauction')}
                          type="secondary"
                        />
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )}
                </Animated>
              </div>
            </Splitted>
          </div>
        </section>
        <Footer isAuctionPage />
      </Layout>
    );
  }

  return null;
};
