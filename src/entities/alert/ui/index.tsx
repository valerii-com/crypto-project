import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';

import { GET_ALERT } from 'shared/api/graphql/state-cache';
import { Alert } from 'shared/ui/alert';

import { useAlerts } from '../lib';
import { Alert as IAlert } from '../model';

import styles from './styles.module.scss';

// interface IAlert {
//   type: 'success' | 'error' | 'info';
//   title: string;
//   message?: string;
//   link?: {
//     label: string;
//     href: string;
//   };

// }

export const GlobalAlerts = () => {
  const [alert, setAlert] = useState<IAlert | null>(null);
  const { removeAlert } = useAlerts();
  const { data } = useQuery(GET_ALERT);

  useEffect(() => {
    setAlert(data.alert);
  }, [data]);

  return (
    <div className={styles.root} style={{ top: alert?.offsetTop || 0 }}>
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div onClick={() => removeAlert()}>
              <Alert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                link={alert.link}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
