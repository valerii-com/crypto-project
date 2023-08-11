/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ReactElement, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { useWeb3React } from '@web3-react/core';
import utils from 'web3-utils';
import { useAtom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { ProcessMyAuction } from 'features/proccess-myauction';
import { StatusLabel } from 'entities/auction/ui/status-label';
import {
  MY_AUCTIONS,
  MY_AUCTIONS_COUNT,
  PARTICIPATED_BY_ME,
  PARTICIPATED_COUNT,
} from 'shared/api/graphql/queries';
import { getPoolAmount } from 'shared/lib/getPoolAmount';
import { truncateString } from 'shared/lib/stringTruncattor';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import { Layout } from 'shared/ui/layout';
import { PhotoPlaceholder } from 'shared/ui/photo-placeholder';
import { Pagination } from 'shared/ui/pagination';
import { Button } from 'shared/ui/button';
import { Auction } from 'shared/interfaces/Auction';
import BackArrow from 'entities/auction/ui/back-arrow';
import { Tabs } from 'entities/tabs/ui';
import { AUCTION_STATUS, ROUTES } from 'shared/constants';

import styles from './styles.module.scss';
import { globalLoading } from 'app/providers/with-apollo';

export const participatedOffsetAtom = atomWithReset(1);
export const createdOffsetAtom = atomWithReset(1);
export const activeTabIdAtom = atomWithReset(2);
const AUCTIONS_PER_PAGE = 10;

const MyAuctionsPage = () => {
  const [tab, setTab] = useAtom<number>(activeTabIdAtom);
  const { t } = useTranslation();
  const { account: initiator, active } = useWeb3React();
  const navigate = useNavigate();
  const account = initiator || '';

  return !active ? (
    <Navigate to={ROUTES.ROOT} />
  ) : (
    <Layout>
      <Header />
      <div className={`container ${styles.container}`}>
        <div className={styles.pageNavigation}>
          <BackArrow
            onClick={() => navigate(ROUTES.ROOT)}
            title={t('myauctions.title')}
            subtitle={t('completed.back')}
          />
          <Tabs
            className={styles.tabs}
            items={[
              { label: t('myauctions.participated'), value: 2 },
              { label: t('myauctions.created'), value: 1 },
            ]}
            onChange={setTab}
            value={tab}
          />
        </div>
        {tab === 1 ? <CreatedAuctions account={account} /> : null}
        {tab === 2 ? <ParticipatedAuctions account={account} /> : null}
      </div>
      <Footer />
    </Layout>
  );
};

interface CreatedAuctionsProps {
  account: string;
}

const CreatedAuctions = ({
  account,
}: CreatedAuctionsProps): ReactElement | null => {
  const viewportWidth = useAdaptation();
  // const [auctions, setAuctions] = useState<Auction[]>([]);
  const [offset, setOffset] = useAtom(createdOffsetAtom);
  const { t } = useTranslation();

  const { data: countData } = useQuery<{ initiatedCount: number }>(
    MY_AUCTIONS_COUNT,
    { variables: { account }, skip: !account },
  );

  const {
    data: { byInitiator: auctions } = { byInitiator: [] },
    fetchMore,
    loading,
  } = useQuery<{ byInitiator: Auction[] }>(MY_AUCTIONS, {
    variables: { account, offset, limit: AUCTIONS_PER_PAGE },
    fetchPolicy: 'cache-first',
    skip: !account,
    onCompleted: () => {
      globalLoading(false);
    },
  });

  const fetchPage = async (page: number) => {
    await fetchMore({
      variables: { account: account, offset, limit: AUCTIONS_PER_PAGE },
    });
    setOffset(page);
  };

  if (!account) return null;
  if (!loading && !auctions.length)
    return (
      <div className={styles.noAuctions}>
        <h1>{t('myauctions.title')}</h1>
        <p>{t('myauctions.none')}</p>
        <Link to="/creating" className="btn">
          <Button label={t('creating.title')} />
        </Link>
      </div>
    );

  return (
    <div className={styles.root}>
      <ul>
        <li>
          <span>{t('auctions.media')}</span>
          <span>{t('auctions.name')}</span>
          <span>{t('auctions.initialreward')}</span>
          <span>{t('auctions.poolamount')}</span>
          <span>{t('auctions.status')}</span>
          <div></div>
        </li>
        {loading || !auctions.length ? (
          <ul></ul>
        ) : (
          auctions.map((auction) => {
            const { ID, token, initialPrice, status, bids } = auction;
            if (viewportWidth > 1023)
              return (
                <li key={ID}>
                  {status === 5 ? (
                    <>
                      <PhotoPlaceholder src={token.meta.image} />
                      <span className={styles.name}>
                        {truncateString(token.meta.name, 90)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Link to={`/auction?id=${ID}`}>
                        <PhotoPlaceholder
                          className={styles.photo}
                          src={token.meta.image}
                        />
                      </Link>
                      <Link to={`/auction?id=${ID}`}>
                        <span className={styles.name}>
                          {truncateString(token.meta.name, 90)}
                        </span>
                      </Link>
                    </>
                  )}
                  <span>{utils.fromWei(initialPrice, 'ether')} BNB</span>
                  <span>{getPoolAmount(bids, initialPrice)} BNB</span>
                  <StatusLabel _status={status}>
                    <ProcessMyAuction id={ID} />
                  </StatusLabel>
                </li>
              );

            return (
              <li key={ID}>
                <PhotoPlaceholder
                  src={token.meta.image}
                  className={styles.photo}
                />
                <div className={styles.item}>
                  <div className={styles.title}>
                    <Link to={`/auction?id=${ID}`}>
                      <h4 className={styles.name}>
                        {truncateString(token.meta.name, 90)}
                      </h4>
                    </Link>
                    <StatusLabel _status={status}>
                      <ProcessMyAuction id={ID} />
                    </StatusLabel>
                  </div>
                  <div className={styles.bottom}>
                    <div className={styles.tabs}>
                      <div>
                        <label>{t('auctions.poolamount')}</label>
                        <b>{getPoolAmount(bids, initialPrice)} BNB</b>
                      </div>
                      {bids[bids.length - 1] && (
                        <div>
                          <label>{t('completed.winningbet')}</label>
                          <b>
                            {utils.fromWei(
                              bids[bids.length - 1].bidPrice,
                              'ether',
                            )}{' '}
                            BNB
                          </b>
                        </div>
                      )}
                    </div>
                    <div className={styles.buttons}>
                      <StatusLabel _status={status}>
                        <ProcessMyAuction id={ID} />
                      </StatusLabel>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
      <Pagination
        count={countData?.initiatedCount || 0}
        offset={offset}
        limit={AUCTIONS_PER_PAGE}
        setter={fetchPage}
      />
    </div>
  );
};

interface ParticipatedAuctionProps {
  account: string;
}

const ParticipatedAuctions = ({
  account,
}: ParticipatedAuctionProps): ReactElement | null => {
  const viewportWidth = useAdaptation();
  // const [auctions, setAuctions] = useState<Auction[]>([]);
  const [offset, setOffset] = useAtom(participatedOffsetAtom);
  const { t } = useTranslation();

  const { data: countData } = useQuery<{ participatedCount: number }>(
    PARTICIPATED_COUNT,
    { variables: { account }, skip: !account },
  );

  const {
    loading,
    data: { byParticipant: auctions } = { byParticipant: [] },
    fetchMore,
  } = useQuery<{ byParticipant: Auction[] }>(PARTICIPATED_BY_ME, {
    variables: { account, offset, limit: AUCTIONS_PER_PAGE },
    fetchPolicy: 'cache-first',
    skip: !account,
    onCompleted: () => {
      globalLoading(false);
    },
  });

  const fetchPage = async (page: number) => {
    await fetchMore({
      variables: { account: account, offset, limit: AUCTIONS_PER_PAGE },
    });
    setOffset(page);
  };

  const isUserWinner = (auction: Auction) => {
    const FINISH_STATUSES = [AUCTION_STATUS.CLOSED, AUCTION_STATUS.ENDED];

    return (
      FINISH_STATUSES.includes(auction.status) &&
      account.toLowerCase() ===
        auction.bids[auction.bids.length - 1].bidder.toLowerCase()
    );
  };

  if (!account) return null;
  if (!auctions.length && !loading)
    return (
      <div className={styles.noAuctions}>
        <h1>{t('myauctions.title_participated')}</h1>
        <p>{t('myauctions.none_participated')}</p>
        <Link to="/auction" className="btn">
          <Button label={t('myauctions.current_auction')} />
        </Link>
      </div>
    );

  return (
    <div className={styles.root}>
      <ul>
        <li>
          <span>{t('auctions.media')}</span>
          <span>{t('auctions.name')}</span>
          <span>{t('auctions.initialreward')}</span>
          <span>{t('auctions.poolamount')}</span>
          <span>{t('auctions.status')}</span>
          <div></div>
        </li>
        {loading || !auctions.length ? (
          <ul></ul>
        ) : (
          auctions.map((auction) => {
            const { ID, token, initialPrice, status, bids } = auction;
            if (viewportWidth > 1023)
              return (
                <li key={ID}>
                  {status === 5 ? (
                    <>
                      {isUserWinner(auction) ? <WinnerBadge /> : null}
                      <PhotoPlaceholder
                        src={token.meta.image}
                        className={styles.photo}
                      />
                      <span className={styles.name}>
                        {truncateString(token.meta.name, 90)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Link to={`/auction?id=${ID}`}>
                        {isUserWinner(auction) ? <WinnerBadge /> : null}
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
                    </>
                  )}
                  <span>{utils.fromWei(initialPrice, 'ether')} BNB</span>
                  <span>{getPoolAmount(bids, initialPrice)} BNB</span>
                  <StatusLabel _status={status}>
                    <ProcessMyAuction id={ID} />
                  </StatusLabel>
                </li>
              );

            return (
              <li key={ID}>
                <div className={styles.photoContainer}>
                  <PhotoPlaceholder
                    src={token.meta.image}
                    className={styles.photo}
                  />
                  {isUserWinner(auction) ? <WinnerBadge /> : null}
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>
                    <Link to={`/auction?id=${ID}`}>
                      <h4 className={styles.name}>
                        {truncateString(token.meta.name, 90)}
                      </h4>
                    </Link>
                    <StatusLabel _status={status}>
                      <ProcessMyAuction id={ID} />
                    </StatusLabel>
                  </div>
                  <div className={styles.bottom}>
                    <div className={styles.tabs}>
                      <div>
                        <label>{t('auctions.poolamount')}</label>
                        <b>{getPoolAmount(bids, initialPrice)} BNB</b>
                      </div>
                      {bids[bids.length - 1] && (
                        <div>
                          <label>{t('completed.winningbet')}</label>
                          <b>
                            {utils.fromWei(
                              bids[bids.length - 1].bidPrice,
                              'ether',
                            )}{' '}
                            BNB
                          </b>
                        </div>
                      )}
                    </div>
                    <div className={styles.buttons}>
                      <StatusLabel _status={status}>
                        <ProcessMyAuction id={ID} />
                      </StatusLabel>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
      <Pagination
        count={countData?.participatedCount || 0}
        offset={offset}
        limit={AUCTIONS_PER_PAGE}
        setter={fetchPage}
      />
    </div>
  );
};

const WinnerBadge = () => {
  const { t } = useTranslation();

  return <div className={styles.winnerBadge}>{t('completed.you_winner')}</div>;
};

export default MyAuctionsPage;
