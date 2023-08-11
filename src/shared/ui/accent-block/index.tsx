import { useAdaptation } from 'shared/lib/viewportAdaptation';

import styles from './styles.module.scss';

type propTypes = {
  param: string;
  subvalue?: string;
  value: string;
  revert?: boolean;
};

export const AccentBlock = ({ param, subvalue, value, revert }: propTypes) => {
  const viewportWidth = useAdaptation();

  return (
    <div className={`${styles.root} ${revert ? styles.revert : ''}`}>
      <div>
        <span>{param}</span>
        {viewportWidth > 1023 && subvalue && (
          <span className={styles.subvalue}>{subvalue}</span>
        )}
      </div>
      <div>
        <b>{value}</b>
        {viewportWidth < 1024 && subvalue && (
          <span className={styles.subvalue} data-featured="true">
            {subvalue}
          </span>
        )}
      </div>
    </div>
  );
};
