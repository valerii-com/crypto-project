import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';

import { useOnClickOutside } from 'shared/lib/useOnClickOutSide';

import de from 'shared/assets/icons/lang/deutch.svg';
import ru from 'shared/assets/icons/lang/russian.svg';
import en from 'shared/assets/icons/lang/states.svg';

import { ActiveLanguage } from './active';
import styles from './styles.module.scss';
export interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation('ns1', { useSuspense: false });
  const [lang] = i18n.language.toLocaleLowerCase().split(/-|_/g);
  const [language, setLanguage] = useState(lang);
  const [showSwitcher, setSwitcher] = useState(false);
  const ref = useRef() as MutableRefObject<HTMLInputElement>;
  useOnClickOutside(ref, () => setSwitcher(false));

  const changeLanguage = (lang: string) => {
    setSwitcher(false);
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    setLanguage(lang);
  }, [lang]);

  return (
    <>
      <div className={classNames(styles.root, className)}>
        <div onClick={() => setSwitcher(true)} className={styles.active}>
          <ActiveLanguage lang={language} />
        </div>
        <AnimatePresence>
          {showSwitcher && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div ref={ref} className={styles.dropdown}>
                <button
                  onClick={() => changeLanguage('de')}
                  className={language === 'de' ? styles.current : ''}
                >
                  DE <img src={de} alt="" />
                </button>
                <button
                  onClick={() => changeLanguage('ru')}
                  className={language === 'ru' ? styles.current : ''}
                >
                  RU <img src={ru} alt="" />
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={language === 'en' ? styles.current : ''}
                >
                  EN <img src={en} alt="" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
