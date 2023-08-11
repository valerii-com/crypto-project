import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { AnimatePresence } from 'framer-motion';

import { Modal } from 'shared/ui/modal';
import { Bid } from 'shared/interfaces/Bid';

import { useAdaptation } from 'shared/lib/viewportAdaptation';

import styles from './styles.module.scss';
import { BidsTable, BidsTableVariant } from './BidsTable';

type propTypes = {
  bids: Bid[];
  className?: string;
};

export const BidsHistory = ({ bids, className = '' }: propTypes) => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const [showHistory, setShowHistory] = useState(false);

  const getRightPadding = () => {
    if (viewportWidth > 1023) return 30;
    if (viewportWidth > 767) return 20;

    return 10;
  };

  return (
    <>
      <AnimatePresence>
        {showHistory && (
          <Modal
            className={styles.modal}
            closeModal={() => setShowHistory(false)}
            styling={{ paddingRight: getRightPadding() }}
          >
            <h3>{t('auctions.bets_history')}</h3>

            <BidsTable
              bids={bids}
              className={styles.bidsList}
              variant={BidsTableVariant.bold}
            />
          </Modal>
        )}
      </AnimatePresence>

      <div className={`link ${className}`} onClick={() => setShowHistory(true)}>
        {t('auctions.view_history')}
      </div>
    </>
  );
};
