import styles from './styles.module.scss';
import Portal from '../modal/portal';

export const LocalLoader = () => {
  return (
    <Portal>
      <div className={styles.root}>
        <div className={styles.modal}>
          <div className={styles.loader}>Loading...</div>
        </div>
      </div>
    </Portal>
  );
};
