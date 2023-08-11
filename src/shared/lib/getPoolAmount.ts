import utils from 'web3-utils';

import { Bid } from 'shared/interfaces/Bid';
import { Wei } from 'shared/interfaces/Wei';

export const getPoolAmount = (bids: Bid[], initialPrice: Wei) => {
  if (!bids.length) return 0;

  const bank = utils.fromWei(bids[bids.length - 1].bank, 'ether');
  const initial = utils.fromWei(initialPrice, 'ether');

  return (parseFloat(bank) - parseFloat(initial)).toFixed(3);
};
