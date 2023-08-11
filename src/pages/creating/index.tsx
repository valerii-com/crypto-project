import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import {
  ApproveNft,
  creatingState,
  TransferNft,
} from 'features/create-auction';
import { TokenPreview } from 'entities/auction';
import { Layout } from 'shared/ui/layout';
import { AmountInput } from 'shared/ui/amount-input';
import { Splitted } from 'shared/ui/splitted';
import { useTokenInfo } from 'shared/lib/useTokenInfo';

import styles from './styles.module.scss';

const CreatingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0.001);
  const { activeItem, erc } = creatingState();

  useEffect(() => {
    if (!activeItem) navigate('/selecting');
  }, [activeItem, navigate]);

  const changeAmount = (ev: ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(ev.target.value);
    const state = creatingState();

    creatingState({ ...state, activeItem: { ...state.activeItem!, amount } });
  };

  return (
    <Layout>
      <Header />
      <div className={`container ` + styles.wrapper}>
        <div className={`${styles.root}`}>
          <Splitted>
            <div className={styles.mobileContainer}>
              {activeItem ? <TokenPreview token={activeItem} /> : <></>}
            </div>
            <div className={styles.inner}>
              <h2>{t('creating.title')}</h2>
              <div className={styles.heading}>
                <b>{t('creating.settings')}</b> <b>{t('creating.step')} 2/2</b>
              </div>
              {erc === 1155 && (
                <div className={styles.input1155}>
                  <label>{t('creating.label1155')}</label>
                  <input
                    type="number"
                    placeholder="1"
                    onChange={changeAmount}
                  />
                </div>
              )}
              <label>{t('creating.reward')}</label>
              <AmountInput minBid={0.001} value={value} setValue={setValue} />
              <span>
                {t('creating.rules')}
                <a href="google.com">{t('creating.rules_link')}</a>
              </span>
              <div className={styles.buttons}>
                <ApproveNft />
                <TransferNft initialReward={value} />
              </div>
              <Link to="/selecting?back=1" className="link">
                {t('creating.previousstep')}
              </Link>
            </div>
          </Splitted>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default CreatingPage;
