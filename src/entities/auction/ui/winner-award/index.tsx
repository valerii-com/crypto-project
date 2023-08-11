import { useEffect, useState } from 'react';
import utils from 'web3-utils';

import { useTranslation } from 'react-i18next';

import { AccentBlock } from 'shared/ui/accent-block';

import { Wei } from 'shared/interfaces/Wei';

import { coinPriceFetcher } from './lib';

type propTypes = { award: Wei };

export const WinnerAward = ({ award }: propTypes) => {
  const { t } = useTranslation();
  const [convertedAward, setConvertedAward] = useState('');
  const BNB = utils.fromWei(award, 'ether');

  useEffect(() => {
    async function fetchUSD() {
      const usd: Promise<number> = await coinPriceFetcher();

      const converted = (await usd) * parseFloat(BNB);

      setConvertedAward(converted.toFixed(2));
    }

    fetchUSD();
  }, [BNB]);

  return (
    <AccentBlock
      param={t('auctions.winneraward')}
      subvalue={`$ ${convertedAward}`}
      value={`${BNB} BNB`}
    />
  );
};
