import { ReactNode, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Animated } from 'shared/ui/animated';
import { cryptoFormatter } from 'shared/lib/cryptoFormatter';
import { addressFormatter } from 'shared/lib/addressFormatter';
import { useOnClickOutside } from 'shared/lib/useOnClickOutSide';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import bnb from 'shared/assets/icons/bnb.svg';
import chevron from 'shared/assets/icons/chevron.svg';

import styles from './styles.module.scss';

type propTypes = {
  address?: string | null;
  balance: string;
  children: ReactNode[];
};

export const Viewer = ({ address, balance, children }: propTypes) => {
  const { t } = useTranslation();
  const viewportWidth = useAdaptation();
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [showDropdown, setShowDropdown] = useState(false);

  useOnClickOutside(ref, () => setShowDropdown(false));

  const toggleDropdown = () => {
    if (viewportWidth > 1023) {
      setShowDropdown(!showDropdown);
    }
  };

  if (!address) return <>{children[0]}</>;

  return (
    <div className={styles.root} onClick={toggleDropdown} ref={ref}>
      <img src={bnb} alt="" />
      <span>{balance ? `${cryptoFormatter(balance)} BNB` : `Loading...`}</span>
      {viewportWidth > 1023 && (
        <button className={showDropdown ? `${styles.active}` : ''}>
          <img src={chevron} alt="chevron" />
        </button>
      )}
      <Animated show={showDropdown}>
        <div className={styles.wrapper}>
          <div className={styles.dropdown}>
            <div>{addressFormatter(address)}</div>
            <div className={styles.nav}>
              <Link className="link" to="/my-auctions">
                {t('myauctions.title')}
              </Link>
              {children ? children[1] : null}
            </div>
          </div>
        </div>
      </Animated>
    </div>
  );
};
