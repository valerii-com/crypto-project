import * as React from 'react';
import { motion } from 'framer-motion';

import styles from './mobile-menu.module.scss';

const Path = (props: React.ComponentProps<typeof motion.path>) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="#7460FF"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button className={styles.button} onClick={toggle}>
    {/*<svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
    {/*  <rect width="24" height="2" rx="1" fill="#7460FF"/>*/}
    {/*  <rect y="8" width="24" height="2" rx="1" fill="#7460FF"/>*/}
    {/*  <rect y="16" width="14" height="2" rx="1" fill="#7460FF"/>*/}
    {/*</svg>*/}

    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
);
