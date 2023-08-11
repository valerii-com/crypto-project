import classNames from 'classnames';

import styles from './styles.module.scss';

export interface BurgerButtonProps {
  opened?: boolean;
  onClick?: () => void;
  className?: string;
}

const BurgerButton = ({
  opened = false,
  onClick,
  className,
}: BurgerButtonProps) => {
  return (
    <div
      className={classNames(
        styles.button,
        { [styles.opened]: opened },
        className,
      )}
      onClick={onClick}
    >
      <span className={`${styles.line} ${styles.first}`}></span>
      <span className={`${styles.line} ${styles.second}`}></span>
      <span className={`${styles.line} ${styles.third}`}></span>
    </div>
  );
};

export default BurgerButton;
