import styles from './styles.module.scss';

type propTypes = { children: React.ReactChild | React.ReactChild[] };

export const Splitted = ({ children }: propTypes) => {
  return <div className={styles.root}>{children}</div>;
};
