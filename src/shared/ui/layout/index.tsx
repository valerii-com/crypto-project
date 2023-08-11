import { motion } from 'framer-motion';

import styles from './styles.module.scss';

type propTypes = {
  children: React.ReactChild | React.ReactChild[];
  isScrollable?: boolean;
};

export const Layout = ({ children, isScrollable = true }: propTypes) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className={`${styles.root} 
    ${isScrollable || `${styles.notScrollable}`}`}
      >
        {children}
      </div>
    </motion.div>
  );
};
