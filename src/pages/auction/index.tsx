import { lazy, useEffect, useState } from 'react';
import { QueryResult, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { GET_AUCTION } from 'shared/api/graphql/queries';
import { Loader } from 'shared/ui/loader';
import { Auction } from 'shared/interfaces/Auction';
import { AUCTION_STATUS } from 'shared/constants';

import { getAuctionID } from './lib';
import { useWeb3React } from '@web3-react/core';
import { client, globalLoading } from 'app/providers/with-apollo';

const CompletedAuction = lazy(() =>
  import('./CompletedAuction').then((module) => ({
    default: module.CompletedAuction,
  })),
);
const UpcomingAuction = lazy(() =>
  import('./UpcomingAuction').then((module) => ({
    default: module.UpcomingAuction,
  })),
);
const ActiveAuction = lazy(() =>
  import('./ActiveAuction').then((module) => ({
    default: module.ActiveAuction,
  })),
);

type propTypes = { currentId?: number };

const AuctionPage = ({ currentId }: propTypes) => {
  const { account } = useWeb3React();
  const [auction, setAuction] = useState<Auction>();
  const navigate = useNavigate();

  const id = getAuctionID() || currentId;

  useEffect(() => {
    if (account && auction) {
      const { status } = auction;
      if (status === AUCTION_STATUS.ENDED || status === AUCTION_STATUS.CLOSED) {
        client.refetchQueries({ include: 'active' });
        if (
          auction.bids.findIndex(
            (bid) => bid.bidder.toLowerCase() === account?.toLowerCase(),
          ) !== -1
        ) {
          navigate(`/auction?id=${id}`);
        }
      }
    }
  }, [auction, account, id, navigate]);

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
  }, [data]);

  useEffect(() => {
    if (window.ethereum) {
      const { ethereum, location } = window;

      ethereum.on('accountsChanged', () => location.reload());

      return () => {
        ethereum.removeListener('accountsChanged', () => location.reload());
      };
    }
  }, []);

  if (error) {
    const ServerErrorPage = lazy(() => import('../server-error'));

    return <ServerErrorPage />;
  }

  if (auction) {
    switch (auction.status) {
      case AUCTION_STATUS.ENDED: {
        return <CompletedAuction currentId={id} />;
      }
      case AUCTION_STATUS.CLOSED: {
        return <CompletedAuction currentId={id} />;
      }
      case AUCTION_STATUS.AWAITING: {
        return <UpcomingAuction currentId={id} />;
      }
      default: {
        return <ActiveAuction auction={auction} setAuction={setAuction} />;
      }
    }
  }

  return null;
};

export default AuctionPage;
