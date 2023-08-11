import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';

type propTypes = {
  count: number;
  offset: number;
  limit: number;
  setter: (page: number) => Promise<void>;
};

export const Pagination = ({ count, offset, limit, setter }: propTypes) => {
  const { t } = useTranslation();
  if (count < limit) return <></>;

  const pages = [];
  const pagesCount = Math.ceil(count / limit);

  if (offset - 2 > 0) pages.push(offset - 2);
  if (offset - 1 > 0) pages.push(offset - 1);
  pages.push(offset);
  if (pagesCount - offset > 0) pages.push(offset + 1);
  if (pagesCount - (offset + 1) > 0) pages.push(offset + 2);

  if (pages.length < 5) {
    for (let i = offset + 3; i < pagesCount; i++) {
      if (pages.length < 5) pages.push(i);
    }
    if (pages.length < 5) {
      for (let i = offset - 3; i > 0; i--) {
        if (pages.length < 5) pages.push(i);
      }
    }
  }

  pagesCount - offset > 2 && pages.push(pagesCount);
  pages.sort((a, b) => a - b);

  return (
    <div className={styles.root}>
      {offset - 1 > 0 && (
        <button onClick={() => setter(offset - 1)}>
          {t('pagination.previous')}
        </button>
      )}
      <div>
        {(offset - 3 > 0 && pagesCount > 5) && (
          <>
            <button onClick={() => setter(1)}>1</button>
            {offset - 4 > 0 ? <span>...</span> : null}
          </>
        )}
        {pages.map((el, i) => {
          if (el === offset)
            return (
              <button key={i} className={styles.active}>
                {offset}
              </button>
            );
          if (i === 5)
            return (
              <div key={i}>
                <span>...</span>
                <button key={i} onClick={() => setter(el)}>
                  {el}
                </button>
              </div>
            );

          return (
            <button key={i} onClick={() => setter(el)}>
              {el}
            </button>
          );
        })}
      </div>

      {offset < pagesCount && (
        <button onClick={() => setter(offset + 1)}>
          {t('pagination.next')}
        </button>
      )}
    </div>
  );
};
