import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { WinnerAward } from 'entities/auction';
import { Auction } from 'shared/interfaces/Auction';
import { Wei } from 'shared/interfaces/Wei';
import { AccentBlock } from 'shared/ui/accent-block';
import { Button } from 'shared/ui/button';

import styles from './styles.module.scss';

export const WaitingBlock = ({ reward }: { reward: Wei }) => {
  const { t } = useTranslation();

  return (
    <>
      <WinnerAward award={reward} />
      <AccentBlock
        param={t('auctions.completion')}
        value={t('auctions.awaiting')}
      />
    </>
  );
};

type activeBlockProps = { reward: Wei; children: React.ReactChild };
const ActiveBlock = ({ reward, children }: activeBlockProps) => {
  return (
    <>
      <WinnerAward award={reward} />
      {children}
    </>
  );
};

type completedProps = { nextAuction?: undefined | number };
export const CompletedBlock = ({ nextAuction }: completedProps) => {
  const { t } = useTranslation();

  return (
    <>
      <h3 className={styles.headingCompleted}>{t('auctions.completed')}</h3>
      {nextAuction && (
        <Link to="/">
          <Button label={t('auctions.nextauction')} />
        </Link>
      )}
    </>
  );
};

type propTypes = {
  auction: Auction;
  children: React.ReactChild;
  nextAuction: number | undefined;
};

export const Heading = ({ auction, children, nextAuction }: propTypes) => {
  const { status, reward } = auction;

  switch (status) {
    case 0:
      return <WaitingBlock reward={reward} />;
    case 1:
      return <WaitingBlock reward={reward} />;
    case 2:
      return <ActiveBlock reward={reward}>{children}</ActiveBlock>;
    default:
      return <CompletedBlock nextAuction={nextAuction} />;
  }
};
