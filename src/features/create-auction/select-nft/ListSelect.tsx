import { useTranslation } from 'react-i18next';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import { Layout } from 'shared/ui/layout';
import { Button } from 'shared/ui/button';
import noResultIllustration from 'shared/assets/img/cross.svg';

import styles from './styles.module.scss';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAddressTokens } from 'shared/lib/useAddressTokens';
import { useWeb3React } from '@web3-react/core';
import { PhotoPlaceholder } from 'shared/ui/photo-placeholder';
import { Link } from 'react-router-dom';
import BackArrow from 'entities/auction/ui/back-arrow';
import { MoralisToken } from 'shared/interfaces/Morails';
import { SvgChoosedMark } from 'shared/assets/svg';
import { AnimatePresence } from 'framer-motion';

type propTypes = {
  tokens: MoralisToken[];
  selectedItem: MoralisToken | null;
  setSelectedItem: Dispatch<SetStateAction<MoralisToken | null>>;
};

export const ListSelect = ({
  tokens,
  selectedItem,
  setSelectedItem,
}: propTypes) => {
  const isActive = (token: MoralisToken) =>
    token.token_address === selectedItem?.token_address &&
    token.token_id == selectedItem?.token_id;

  return (
    <ul className={styles.list}>
      {tokens.map((token) =>
        token.metadata.image ? (
          <li
            key={token.token_uri}
            className={styles.item}
            onClick={() => setSelectedItem(token)}
          >
            <div
              className={`${styles.thumb} ${
                isActive(token) ? styles.active : ''
              }`}
            >
              <PhotoPlaceholder src={token.metadata.image} />
              {isActive(token) ? (
                <div className={styles.marked}>
                  <SvgChoosedMark />
                </div>
              ) : (
                ''
              )}
            </div>
            <div className={styles.tokenInfo}>
              <span className={styles.tokenTitle}>{token.metadata.name}</span>
              <span className={styles.tokenType}>{token.contract_type}</span>
            </div>
          </li>
        ) : null,
      )}
    </ul>
  );
};
