import Web3 from 'web3';
import { EventLog } from 'web3-core';
import { io } from 'socket.io-client';

import { Dispatch, SetStateAction } from 'react';

import AUCTION_ABI from 'shared/api/blockchain/ABIes/Auction-ABI.json';
import { Auction } from 'shared/interfaces/Auction';
import { Bid } from 'shared/interfaces/Bid';

export const blockchainSubscription = (
  id: number,
  setAuction: Dispatch<SetStateAction<Auction | undefined>>,
) => {
  const web3 = new Web3(import.meta.env.VITE_RPC_NODE as string);

  const contract = new web3.eth.Contract(
    AUCTION_ABI as any,
    import.meta.env.VITE_AUCTION_CONTRACT_ADDRESS,
  );

  console.log('contract listener initialized');

  return contract.events
    .BidPlaced()
    .on('data', async function (event: EventLog) {
      const { returnValues, transactionHash: tx } = event;
      const endIn = await contract.methods.biddingEnd(id).call();
      const { winnerReward } = await contract.methods.countReward(id).call();
      const minNext = await contract.methods.countNextMinBidPrice(id).call();

      setAuction((state) => {
        const bids: Bid[] = [
          ...state!.bids,
          { ...returnValues, endIn, minNext, date: +Date.now(), tx },
        ];

        return { ...state, bids, status: 2, reward: winnerReward } as any;
      });
    })
    .on('error', () => blockchainSubscription(id, setAuction));
};

export const socketSubscription = (
  setNextAuction: Dispatch<SetStateAction<number | undefined>>,
) => {
  const socket = io(import.meta.env.VITE_SERVER_URI!);

  socket.on('nextAuctionID', (data) => {
    setNextAuction(data);
  });

  return socket;
};
