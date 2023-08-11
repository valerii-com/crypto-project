import { useQuery } from '@apollo/client';
import { useWeb3React } from '@web3-react/core';

import { CSSProperties, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useInViewport } from 'react-in-viewport';

import { ConnectWallet } from 'features/auth/connect-wallet';
import { GET_COMPLETED } from 'shared/api/graphql/queries';
import { Auction } from 'shared/interfaces/Auction';
import { Button } from 'shared/ui/button';
import { PhotoPlaceholder } from 'shared/ui/photo-placeholder';

import { useDimensions } from 'widgets/mobile-menu/use-dimensions';

import styles from './styles.module.scss';

const AUCTIONS_PER_PAGE = 20;

export const ComingSoon = () => {
  const { active } = useWeb3React();
  const { t } = useTranslation();

  const blockRef = useRef<HTMLElement>(null);

  const { width } = useDimensions(blockRef);

  const { enterCount } = useInViewport(blockRef);

  const { data } = useQuery<{ completed: Auction[] }>(GET_COMPLETED, {
    variables: { offset: 0, limit: AUCTIONS_PER_PAGE },
    fetchPolicy: 'cache-and-network',
  });

  const [firstRowItems, secondRowItems] = useMemo<Auction[][]>(() => {
    let firstRow = [];
    let secondRow = [];
    if (data?.completed) {
      firstRow = data?.completed.slice(0, data.completed.length / 2);
      secondRow = data?.completed.slice(
        data.completed.length / 2,
        data.completed.length - 1,
      );
    } else {
      firstRow = data?.completed.slice(0, 10) || [];
      secondRow = data?.completed.slice(10, 20) || [];
    }
    firstRow = firstRow?.concat(firstRow).concat(firstRow);
    secondRow = secondRow?.concat(secondRow).concat(secondRow);

    return [firstRow, secondRow];
  }, [data]);

  return (
    <section
      className={`${styles.container}`}
      ref={blockRef}
      id="auction"
      style={
        {
          '--component-width': `${width}px`,
        } as CSSProperties
      }
    >
      <div
        className={`${styles.row} ${styles.firstRow} ${
          enterCount > 0 && styles.animationFirstRow
        }`}
      >
        {data &&
          firstRowItems.map(({ token }, index) => {
            return (
              <div key={index} className={styles.image}>
                <PhotoPlaceholder src={token.meta.image} />
              </div>
            );
          })}
      </div>
      <div
        className={`${styles.row}  ${styles.secondRow} ${
          enterCount > 0 && styles.animationSecondRow
        }`}
      >
        {data &&
          secondRowItems.map(({ token }, index) => {
            return (
              <div key={index} className={styles.image}>
                <PhotoPlaceholder src={token.meta.image} />
              </div>
            );
          })}
      </div>
      <div className={styles.modal}>
        <h3 className={styles.header}>{t('comingsoon.title')}</h3>
        <p className={styles.description}>{t('comingsoon.description')}</p>
        {active ? (
          <Link to="/selecting">
            <Button type="primary" label={t('creating.title')} />
          </Link>
        ) : (
          <>
            <ConnectWallet>
              <Button type="primary" label={t('connectwallet.title')} />
            </ConnectWallet>
          </>
        )}
      </div>
    </section>
  );
};
