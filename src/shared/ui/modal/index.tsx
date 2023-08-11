import { CSSProperties, ReactNode, useRef } from 'react';
import { motion } from 'framer-motion';

import { useOnClickOutside } from 'shared/lib/useOnClickOutSide';
import closer from 'shared/assets/icons/modal-closer.svg';

import Portal from './portal';
import styles from './styles.module.scss';

type propTypes = {
  children: ReactNode;
  styling?: CSSProperties | undefined;
  closeModal?: () => void;
  className?: string;
};

type AnimationStopRecord<T> = Record<string, T>;
interface AnimationStops<T> {
  initial: AnimationStopRecord<T>;
  animate: AnimationStopRecord<T>;
  exit: AnimationStopRecord<T>;
}

const modalAnimationConfig: AnimationStops<number> = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const Modal = ({
  children,
  styling,
  closeModal,
  className = '',
}: propTypes) => {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

  const { initial, animate, exit } = modalAnimationConfig;

  useOnClickOutside(ref, () => closeModal && closeModal());

  return (
    <Portal>
      <motion.div initial={initial} animate={animate} exit={exit}>
        <div className={styles.root}>
          <div
            className={`${styles.modal} ${className}`}
            ref={ref}
            style={styling}
          >
            {children}
            {closeModal && (
              <div onClick={closeModal}>
                <img src={closer} className={styles.closer} alt="close" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Portal>
  );
};
