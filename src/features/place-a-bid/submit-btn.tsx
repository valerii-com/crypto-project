import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';

import { Auction } from 'shared/interfaces/Auction';
import { Button } from 'shared/ui/button';

type propTypes = { auction: Auction };

export const Submit = ({ auction }: propTypes) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const { bids, initiator } = auction;
  const currentBid = bids[bids.length - 1];

  if (currentBid?.bidder === account) {
    return <Button label={t('bidding.highest')} isDisabled />;
  } else if (!bids.length && initiator === account) {
    return <Button label={t('bidding.waiting')} isDisabled />;
  } else {
    return <Button label={t('bidding.place')} isSubmit />;
  }
};
