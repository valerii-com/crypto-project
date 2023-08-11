import Lottie from 'lottie-react';
import { useState } from 'react';

import groovyWalkAnimation from './G-skeleton.json';
import styles from './styles.module.scss';

type propTypes = {
  src: string;
  className?: string;
  dataFancybox?: string;
  dataSrc?: string;
  alt?: string;
};

export const PhotoPlaceholder = ({
  src,
  className = '',
  dataFancybox: fancybox,
  dataSrc,
  alt = '',
}: propTypes) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const url = src.startsWith('http')
    ? src
    : `${import.meta.env.VITE_SERVER_URI}/${src}`;

  if (error || !src)
    return (
      <div className={`${styles.placeholderContainer} ${className}`}>
        <Lottie
          className={styles.placeholder}
          animationData={groovyWalkAnimation}
          aria-labelledby="use lottie animation"
        />
      </div>
    );

  return (
    <div
      className={`${styles.imageHolder} ${
        loaded ? styles.loaded : ''
      } ${className}`}
    >
      <div className={styles.placeholderContainer}>
        <Lottie
          className={styles.placeholder}
          animationData={groovyWalkAnimation}
          aria-labelledby="use lottie animation"
        />
      </div>
      <img
        className={styles.actualImage}
        src={url}
        alt={alt}
        data-fancybox={fancybox}
        data-src={dataSrc}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};
