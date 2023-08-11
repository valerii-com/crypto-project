import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccentBlock } from 'shared/ui/accent-block';
import { timeFormatter } from 'shared/lib/timeFormatter';
import { Auction } from 'shared/interfaces/Auction';

type propTypes = {
  endIn: number;
  setAuction: React.Dispatch<React.SetStateAction<Auction | undefined>>;
};

export const CompletionTimer = ({ endIn, setAuction }: propTypes) => {
  const { t } = useTranslation();
  const didMount = useRef(false);
  const [ticker, setTicker] = useState<NodeJS.Timeout | undefined>();
  const [endingTime, setEndingTime] = useState('Loading...');
  const [restartedTimer, setRestartedTimer] = useState(false);

  useEffect(() => {
    ticker && clearInterval(ticker);

    const time = setInterval(parseCompleteonTime, 1000);

    setTicker(time);

    if (didMount.current) {
      setRestartedTimer(true);
      setTimeout(() => setRestartedTimer(false), 1000);
    } else {
      didMount.current = true;
    }

    // eslint-disable-next-line
  }, [endIn]);

  const setOver = () => {
    setAuction((state) => state && { ...state, status: 3 });
  };

  const parseCompleteonTime = () => {
    const now = new Date();
    const endDate = new Date(endIn * 1000);

    const timeFrame = endDate.getTime() - now.getTime();

    timeFrame > 0 ? setEndingTime(timeFormatter(timeFrame)) : setOver();
  };

  return (
    <AccentBlock
      param={t('auctions.completion')}
      value={restartedTimer ? t('auctions.newbid') : endingTime}
      revert={restartedTimer}
    />
  );
};
