import { MouseEventHandler, ReactElement } from 'react';

import styles from './styles.module.scss';

type propTypes = {
  type?: 'primary' | 'secondary';
  label?: string | boolean | ReactElement;
  isSubmit?: boolean;
  isDisabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({
  type = 'primary',
  label = false,
  isSubmit,
  isDisabled = false,
  onClick,
  className = '',
}: propTypes) => {
  const styleClass =
    type === 'primary' ? `${styles.primary}` : `${styles.secondary}`;
  const loadingClass = label ? '' : `${styles.loading}`;
  const disabledClass = isDisabled ? `${styles.disabled}` : '';

  const classNameString = `${styleClass} ${loadingClass} ${disabledClass} ${className}`;

  return (
    <button
      type={`${isSubmit ? 'submit' : 'button'}`}
      className={classNameString}
      onClick={onClick}
    >
      {label ? label : <div className={styles.loader}>Loading...</div>}
    </button>
  );
};
