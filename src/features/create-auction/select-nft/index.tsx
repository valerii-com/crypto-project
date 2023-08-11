/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

import { useTranslation } from 'react-i18next';

import { useAlerts } from 'entities/alert';

import { useBlockchain } from 'shared/api/blockchain';
import { Button } from 'shared/ui/button';
import { useException } from 'shared/lib/exceptions';
import { Exception } from 'shared/interfaces/Exception';

import { creatingState } from '../model';

import styles from './styles.module.scss';

import { getTokenStandart, TokenResponse } from './lib';
import { MoralisToken } from 'shared/interfaces/Morails';
import { useAddressTokens } from 'shared/lib/useAddressTokens';
import { AnimatePresence } from 'framer-motion';
import { ManualSelect } from './ManualSelect';
import { Footer } from 'widgets/footer';
import { ListSelect } from './ListSelect';
import noResultIllustration from 'shared/assets/img/cross.svg';
import { useAdaptation } from 'shared/lib/viewportAdaptation';
import axios from 'axios';
type propTypes = { children: any };

export const SelectNft = ({ children }: propTypes) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addAlert } = useAlerts();
  const { library, account } = useWeb3React();
  const blockchain = useBlockchain(library);
  const [selectedItem, setSelectedItem] = useState<MoralisToken | null>(null);
  const [openManual, setOpenManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const tokens = useAddressTokens();
  const { exception } = useException();
  const viewportWidth = useAdaptation();
  const urlParams = new URLSearchParams(window.location.search);
  const back = urlParams.get('back')!;

  useEffect(() => {
    const state = creatingState();

    if (back && state && state.activeItem && tokens) {
      const token = tokens.find(
        (token) => token.token_id == state.activeItem?.id,
      );

      token && setSelectedItem(token);
    }
  }, [back, tokens]);

  const submitHandler = async (address: string, id: number) => {
    if (!selectedItem) return;

    setLoading(true);

    try {
      const token: TokenResponse | undefined = await blockchain.getTokenInfo(
        address,
        id,
        account!,
      );

      if (token) {
        creatingState({
          activeItem: {
            address,
            id,
            owner: account!,
            meta: {
              ...(token.metadata ||
                (await (
                  await axios.get(token.token_uri)
                ).data)),
              contractType: token.contract_type,
            },
          },
          erc: getTokenStandart(token.contract_type),
        });

        navigate('/create');
      } else {
        addAlert({
          type: 'error',
          title: t('creating.notfound'),
          message: t('creating.notfound_msg'),
        });
      }
    } catch (e) {
      console.error(e);

      exception(e as Exception);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.manual}>
            <span>
              If you don't see your NFT listed, try adding it manually.
            </span>
            <Button
              type="secondary"
              label={viewportWidth < 1024 ? 'Add nft' : 'Add NFT manually'}
              onClick={() => setOpenManual(true)}
            />
          </div>
          {tokens ? (
            tokens.length ? (
              <ListSelect
                tokens={tokens}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            ) : (
              <div className={styles.noResults}>
                <span>
                  You don't have any NFTs. You can add the first NFT manually.
                </span>
                <Button
                  label="Add NFT manually"
                  onClick={() => setOpenManual(true)}
                />
              </div>
            )
          ) : (
            <ul className={`${styles.list} ${styles.skeletonList}`}>
              {Array(4) // TO-DO Dynamic amount width view port
                .fill({})
                .map((_, i) => (
                  <div key={i} className={styles.skeleton}></div>
                ))}
            </ul>
          )}
        </div>
      </div>
      {tokens ? (
        tokens.length ? (
          <div className={styles.strange}>
            <div className="container">
              <div className={styles.steps}>
                {loading ? (
                  <button
                    className={`${styles.button} ${styles.disabled} ${styles.loading}`}
                  >
                    <div className={`${styles.loader}`}>Loading...</div>
                  </button>
                ) : (
                  <Button
                    label="To the next step"
                    isDisabled={!selectedItem}
                    onClick={() =>
                      submitHandler(
                        selectedItem?.token_address!,
                        selectedItem?.token_id!,
                      )
                    }
                  />
                )}
              </div>
            </div>
            {children}
          </div>
        ) : (
          children
        )
      ) : (
        <div className={styles.strange}>
          <div className="container">
            <div className={styles.steps}>
              <Button
                label="To the next step"
                isDisabled={!selectedItem}
                onClick={() =>
                  submitHandler(
                    selectedItem?.token_address!,
                    selectedItem?.token_id!,
                  )
                }
              />
            </div>
          </div>
          {children}
        </div>
      )}
      <AnimatePresence>
        {openManual && (
          <ManualSelect
            submitHandler={submitHandler}
            selectedItem={selectedItem}
            setOpenManual={setOpenManual}
          />
        )}
      </AnimatePresence>
    </>
  );
};
