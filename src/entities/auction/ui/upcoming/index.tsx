/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import utils from 'web3-utils';
import { motion } from 'framer-motion';

import { addressFormatter } from 'shared/lib/addressFormatter';
import { PhotoPlaceholder } from 'shared/ui/photo-placeholder';
import { useScrollToLocation } from 'shared/lib/useScrollToLocation';
import { Auction } from 'shared/interfaces/Auction';

import { useAdaptation } from '../../../../shared/lib/viewportAdaptation';

import styles from './styles.module.scss';

export const UpcomingAuctions = () => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const [upcomings, setUpcomings] = useState<Auction[]>([]);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingItems, setupcomingItems] = useState(
    upcomings ? upcomings.slice(0, 10) : [],
  );
  useScrollToLocation(!!upcomingItems.length);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URI!);
    socket.on('updateUpcoming', (data) => {
      setUpcomings(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const countItems = viewportWidth < 1380 ? 12 : 10;
    setupcomingItems(upcomings ? upcomings.slice(0, countItems) : []);
  }, [upcomings, viewportWidth]);

  const loadMoreHandler = () => {
    setUpcomingPage(upcomingPage + 1);
    setupcomingItems(upcomings.slice(0, 20 * (upcomingPage + 1)));
  };

  return (
    <div id="upcoming" className={styles.container}>
      {upcomings.length ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.root}
        >
          <h2>{t('upcomings.title')}</h2>
          <ul className={styles.list}>
            {upcomingItems.map((e, i) => (
              <li key={i} className={styles.item}>
                <Link to={`/auction?id=${e.ID}`}>
                  {e.token.meta && (
                    <>
                      <div className={styles.thumb}>
                        <PhotoPlaceholder src={e.token?.meta?.image} />
                      </div>
                      <span className={styles.tokenTitle}>
                        {e.token.meta.name}
                      </span>
                      <span className={styles.author}>
                        {addressFormatter(e.initiator, 10)}
                      </span>
                      <b>{`${utils.fromWei(e.reward, 'ether')} BNB`}</b>
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          {upcomings.length > upcomingPage * 20 && (
            <div className={styles.buttonWrap}>
              <button className="link" onClick={loadMoreHandler}>
                {t('upcomings.laodmore')}
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <></>
      )}
    </div>
  );
};
