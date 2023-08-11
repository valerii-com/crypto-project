import { cloneElement, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';

type propTypes = { _status: number; children: ReactElement };

export const StatusLabel = ({ _status, children }: propTypes) => {
  const [status, setStatus] = useState(_status);
  const { t } = useTranslation();

  const generateLabel = (styling: string, i18n: string) => {
    return (
      <span className={`${styles.root} ${styling}`}>
        {t(`myauctions.${i18n}`)}
      </span>
    );
  };

  const getLabel = () => {
    if (status === 5) return generateLabel(styles.cancelled, 'cancelled');
    if (status > 2) return generateLabel(styles.completed, 'closed');
    if (!status) return generateLabel(styles.waiting, 'waiting');

    return generateLabel(styles.inprogress, 'active');
  };

  return (
    <>
      <>{getLabel()}</>
      {cloneElement(children, { status, setStatus })}
    </>
  );
};
