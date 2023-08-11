import { useReactiveVar } from '@apollo/client';
import Lottie from 'lottie-react';
import classNames from 'classnames';

import { globalLoading } from 'app/providers/with-apollo';

import Portal from '../modal/portal';

import styles from './styles.module.scss';
import groovyWalkAnimation from './animation.json';
import { useState } from 'react';

export interface LoaderProps {
  className?: string;
  isLoading?: boolean;
  isGlobal?: boolean;
}

export const Loader = ({
  className = '',
  isLoading = true,
  isGlobal = false,
}: LoaderProps) => {
  const isLoadingGlobally = useReactiveVar(globalLoading);

  return (
    <Portal>
      <div
        className={classNames(styles.root, className, {
          [styles.isLoading]: isLoading,
          ...(isGlobal && {
            [styles.active]: isLoadingGlobally,
            [styles['global-loader']]: true,
          }),
        })}
      >
        <div className={styles.modal}>
          <Lottie
            animationData={groovyWalkAnimation}
            aria-labelledby="use lottie animation"
          />
        </div>
      </div>
    </Portal>
  );
};
