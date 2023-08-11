import { motion } from 'framer-motion';

import { MenuItem } from './menu-item';
import styles from './mobile-menu.module.scss';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const Navigation = () => (
  <motion.ul className={styles.ul} variants={variants}>
    {itemIds.map((i) => (
      <MenuItem title={i.title} link={i.link} key={i.title} />
    ))}
  </motion.ul>
);

const itemIds = [
  { title: 'Home', link: '/' },
  { title: 'About', link: '/about' },
  { title: 'Contact', link: '/contact' },
];
