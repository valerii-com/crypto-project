import { AnimatePresence, motion } from 'framer-motion';
import { ReactChild } from 'react';

type propTypes = { show?: boolean; children: ReactChild | ReactChild[] };

export const Animated = ({ show, children }: propTypes) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
