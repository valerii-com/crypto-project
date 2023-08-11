import { Alert as IAlert } from 'entities/alert/model';

interface IAlertWithChildren extends IAlert {
  children?: React.ReactNode;
  className?: string;
}

import styles from './styles.module.scss';

export const Alert = ({
  type,
  title,
  message,
  link,
  children,
  className: propClassName = '',
}: IAlertWithChildren) => {
  let className: string;
  switch (type) {
    case 'error':
      className = `${styles.error}`;
      break;
    case 'success':
      className = `${styles.success}`;
      break;
    case 'info':
      className = `${styles.info}`;
      break;
  }

  return (
    <div className={`${styles.root} ${className} ${propClassName}`}>
      <div className={styles.inner}>
        <b>{title}</b>
        <p>
          {link ? (
            <a target={'_blank'} rel="noreferrer" href={link.href}>
              {link.label}
            </a>
          ) : (
            message
          )}
        </p>
        <div>{children}</div>
        <button className={styles.close}>
          <svg xmlns="http://www.w3.org/2000/svg">
            <path d="M0.333339 9.8174C0.180116 9.97062 0.180115 10.219 0.333338 10.3723L1.62803 11.667C1.78126 11.8202 2.02968 11.8202 2.1829 11.667L5.88519 7.96468L9.58747 11.667C9.74069 11.8202 9.98912 11.8202 10.1423 11.667L11.437 10.3723C11.5903 10.219 11.5903 9.97062 11.437 9.8174L7.73475 6.11512L11.4368 2.41303C11.5901 2.25981 11.5901 2.01138 11.4368 1.85816L10.1421 0.563465C9.98892 0.410242 9.7405 0.410242 9.58727 0.563465L5.88519 4.26555L2.1831 0.563465C2.02988 0.410242 1.78145 0.410242 1.62823 0.563465L0.333536 1.85816C0.180313 2.01138 0.180313 2.25981 0.333536 2.41303L4.03562 6.11512L0.333339 9.8174Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
