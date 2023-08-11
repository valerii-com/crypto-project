import { MouseEventHandler } from 'react';

import { ReactComponent as LeftArrowIcon } from 'shared/assets/icons/arrow-left.svg';

import styles from './styles.module.scss';

interface BackArrowProps {
  title: string;
  subtitle?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const BackArrow = ({
  title,
  subtitle = '',
  className = '',
  onClick,
}: BackArrowProps) => {
  return (
    <div onClick={onClick} className={`${styles['page-header']} ${className}`}>
      <LeftArrowIcon className={styles['arrow-back']} />
      <div>
        <h2 className="">{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default BackArrow;
