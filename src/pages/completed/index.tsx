/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import utils from 'web3-utils';
import { useQuery } from '@apollo/client';

import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { ProcessCompleted } from 'features/proccess-completed';
import { Layout } from 'shared/ui/layout';
import { COMPLETED_COUNT, GET_COMPLETED } from 'shared/api/graphql/queries';
import { truncateString } from 'shared/lib/stringTruncattor';
import { getPoolAmount } from 'shared/lib/getPoolAmount';
import { addressFormatter } from 'shared/lib/addressFormatter';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import { Auction } from 'shared/interfaces/Auction';
import { PhotoPlaceholder } from 'shared/ui/photo-placeholder';
import { Pagination } from 'shared/ui/pagination';
import { Button } from 'shared/ui/button';
import image404 from 'shared/assets/img/cross.svg';
import { Loader } from 'shared/ui/loader';

import BackArrow from 'entities/auction/ui/back-arrow';

import styles from './styles.module.scss';
import { globalLoading } from 'app/providers/with-apollo';

const CompletedPage = () => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const { account } = useWeb3React();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [offset, setOffset] = useState<number>(1);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentPage = params.get('page');
    setOffset(() => Number(currentPage || 1));
  }, [location, setOffset]);

  const AUCTIONS_PER_PAGE = 10;

  const { data: countData } = useQuery<{ completedCount: number }>(
    COMPLETED_COUNT,
  );

  const { data, loading } = useQuery<{ completed: Auction[] }>(GET_COMPLETED, {
    variables: { offset, limit: AUCTIONS_PER_PAGE },
    fetchPolicy: 'no-cache',
    onCompleted: () => {
      globalLoading(false);
    },
  });

  const fetchPage = async (page: number) => {
    navigate({
      pathname: '/completed',
      search: `?page=${page}`,
    });
  };

  const goToCompleted = () => {
    navigate('/');
  };

  useEffect(() => {
    data && setAuctions(data.completed);
  }, [data]);

  if (loading) return <Loader />;

  return (
    <Layout>
      <Header />
      <div className="container">
        {auctions.length > 0 ? (
          <div className={styles.root}>
            <Link to={'/'}>
              <BackArrow
                title={t('completed.title')}
                subtitle={t('completed.back')}
                className={styles.back}
              />
            </Link>
            <ul>
              <li className={styles.tr}>
                <span>{t('auctions.media')}</span>
                <span>{t('auctions.name')}</span>
                <span>{t('auctions.poolamount')}</span>
                <span>{t('completed.winningbet')}</span>
                <span>{t('completed.bidderreward')}</span>
                <span>{t('completed.bidderwallet')}</span>
                <div></div>
              </li>
              {auctions.map((auction) => {
                const {
                  ID,
                  token,
                  initiator,
                  initialPrice,
                  status,
                  bids,
                  reward,
                } = auction;

                if (bids[bids.length - 1]) {
                  const { bidder, bidPrice } = bids[bids.length - 1];

                  if (viewportWidth > 1023)
                    return (
                      <li key={ID}>
                        <Link to={`/auction?id=${ID}`}>
                          <PhotoPlaceholder
                            src={token.meta.image}
                            className={styles.photo}
                          />
                        </Link>
                        <Link to={`/auction?id=${ID}`}>
                          <span className={styles.name}>
                            {truncateString(token.meta.name, 90)}
                          </span>
                        </Link>
                        <span>{getPoolAmount(bids, initialPrice)} BNB</span>
                        <span>{utils.fromWei(bidPrice, 'ether')} BNB</span>
                        <span>{utils.fromWei(reward, 'ether')} BNB</span>
                        <span>{addressFormatter(bidder, 10)}</span>
                        <div className={styles.actions}>
                          {(bidder === account || initiator === account) && (
                            <ProcessCompleted
                              id={ID}
                              _status={status}
                              isWinner={bidder === account}
                            />
                          )}
                          <Link to={`/auction?id=${ID}`} className="link">
                            {t('myauctions.view')}
                          </Link>
                        </div>
                      </li>
                    );

                  return (
                    <li key={ID}>
                      <PhotoPlaceholder
                        className={styles.photo}
                        src={token.meta.image}
                      />
                      <div className={styles.item}>
                        <Link to={`/auction?id=${ID}`}>
                          <h4 className={styles.name}>
                            {truncateString(token.meta.name, 90)}
                          </h4>
                        </Link>
                        <div className={styles.tabs}>
                          <div>
                            <label>{t('auctions.poolamount')}</label>
                            <b>{getPoolAmount(bids, initialPrice)} BNB</b>
                          </div>
                          <div>
                            <label>{t('completed.winningbet')}</label>
                            <b>{utils.fromWei(bidPrice, 'ether')} BNB</b>
                          </div>
                          <div>
                            <label>{t('completed.bidderreward')}</label>
                            <b>{utils.fromWei(reward, 'ether')} BNB</b>
                          </div>
                        </div>
                        <div className={styles.bottom}>
                          <span>{addressFormatter(token.owner, 10)}</span>
                          <div className={styles.buttons}>
                            {(bidder === account || initiator === account) && (
                              <ProcessCompleted id={ID} _status={status} />
                            )}
                            <Link to={`/auction?id=${ID}`}>
                              <Button label={t('myauctions.view')} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }

                return null;
              })}
            </ul>
            <Pagination
              count={countData?.completedCount!}
              offset={offset}
              limit={AUCTIONS_PER_PAGE}
              setter={fetchPage}
            />
          </div>
        ) : (
          <div className={styles.noAuctions}>
            <img src={image404} alt="" />
            <h1>{t('completed.title')}</h1>
            <p>{t('completed.none')}</p>
            <Link to="/creating" className="btn">
              <Button label={t('creating.title')} />
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default CompletedPage;
