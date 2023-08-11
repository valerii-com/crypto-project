import { lazy, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QueryResult, useQuery } from '@apollo/client';

import { Header } from 'widgets/header';

import { Footer } from 'widgets/footer';
import { TokenPreview, InformationTable } from 'entities/auction';
import { GET_AUCTION } from 'shared/api/graphql/queries';
import { Loader } from 'shared/ui/loader';
import { Layout } from 'shared/ui/layout';
import { Splitted } from 'shared/ui/splitted';
import { Auction } from 'shared/interfaces/Auction';
import { ROUTES } from 'shared/constants';

import BackArrow from 'entities/auction/ui/back-arrow';
import { WaitingBlock } from 'entities/auction/ui/heading';

import { getAuctionID } from './lib';
import styles from './styles.module.scss';
import { globalLoading } from 'app/providers/with-apollo';

type propTypes = { currentId?: number };
const ServerErrorPage = lazy(() => import('../server-error'));

export const UpcomingAuction = ({ currentId }: propTypes) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<Auction>();
  const id = currentId || getAuctionID();

  const { loading, data, error } = useQuery(GET_AUCTION, {
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
  }, [id, data]);

  if (error) {
    return <ServerErrorPage />;
  }
  // if (loading) return <Loader />;
  if (auction) {
    const { token, reward } = auction;

    return (
      <Layout>
        <Header />
        <section className={styles.auctionWrapper} id="auction">
          <div className="container">
            <Link to="/#upcoming">
              <BackArrow
                title={t('upcomings.title-one')}
                subtitle={t('upcomings.back-one')}
              />
            </Link>
            <div className={styles.auctionHeader}></div>
            <Splitted>
              <TokenPreview token={token} />
              <div className={styles.inner}>
                <div className={styles.heading}>
                  <div className={styles.accents}>
                    <WaitingBlock reward={reward} />
                  </div>
                </div>
                <InformationTable auction={auction} />
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
