import { gql } from '@apollo/client';

import { Bid } from 'shared/interfaces/Bid';
import { Wei } from 'shared/interfaces/Wei';

export type GetActiveData = {
  isActive: number;
};
export const GET_ACTIVE = gql`
  query {
    isActive
  }
`;
export type GetAuctionData = {
  auctionByID: {
    ID: number;
    initiator: string;
    status: number;
    bids: Bid[];
    token: {
      address: string;
      id: number;
      owner: string;
      meta: {
        name: string;
        description: string;
        image: string;
        stringedMeta: string;
        contractType: string;
        tokenUri: string;
        tokenCreator: string;
      };
    };
    reward: Wei;
    initialPrice: Wei;
    timeframe: number;
  };
};
export const GET_AUCTION = gql`
  query ($id: Int!) {
    auctionByID(ID: $id) {
      ID
      initiator
      status
      bids {
        bidPrice
        bidder
        bank
        date
        endIn
        minNext
        transactionHash
      }
      token {
        address
        id
        owner
        meta {
          name
          description
          image
          stringedMeta
          contractType
          tokenUri
          tokenCreator
        }
      }
      reward
      initialPrice
      timeframe
    }
  }
`;
export const MY_AUCTIONS_COUNT = gql`
  query ($account: String!) {
    initiatedCount(account: $account)
  }
`;

export const PARTICIPATED_COUNT = gql`
  query ($account: String!) {
    participatedCount(account: $account)
  }
`;

export const MY_AUCTIONS = gql`
  query ($account: String!, $offset: Int!, $limit: Int!) {
    byInitiator(account: $account, offset: $offset, limit: $limit) {
      ID
      status
      bids {
        bidPrice
        bidder
        bank
        date
        endIn
        minNext
      }
      token {
        owner
        meta {
          name
          image
        }
      }
      initialPrice
    }
  }
`;
export const PARTICIPATED_BY_ME = gql`
  query ($account: String!, $offset: Int!, $limit: Int!) {
    byParticipant(account: $account, offset: $offset, limit: $limit) {
      ID
      status
      bids {
        bidPrice
        bidder
        bank
        date
        endIn
        minNext
      }
      token {
        owner
        meta {
          name
          image
        }
      }
      initialPrice
    }
  }
`;

export const COMPLETED_COUNT = gql`
  query {
    completedCount
  }
`;

export const GET_COMPLETED = gql`
  query ($offset: Int!, $limit: Int!) {
    completed(offset: $offset, limit: $limit) {
      ID
      initiator
      status
      bids {
        bidPrice
        bidder
        bank
        date
        endIn
        minNext
      }
      token {
        owner
        meta {
          name
          image
        }
      }
      reward
      initialPrice
    }
  }
`;
