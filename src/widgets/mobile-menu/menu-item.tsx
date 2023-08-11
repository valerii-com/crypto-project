import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './mobile-menu.module.scss';

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const MenuItem = ({ title, link }: { title: string; link: string }) => {
  const { t } = useTranslation();

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={styles.li}
    >
      <Link to={link} className={styles.textPlaceholder}>
        {t(title)}
      </Link>
    </motion.li>
  );
};
