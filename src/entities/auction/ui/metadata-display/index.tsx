import { TokenInfo } from 'shared/lib/useTokenInfo';
import { addressFormatter } from 'shared/lib/addressFormatter';

import styles from './styles.module.scss';

export interface MetadataDisplayProps {
  tokenInfo: TokenInfo;
}

const BSC_SCAN_BASE_URL = `https://${
  import.meta.env.MODE !== 'prod' && 'testnet.'
}bscscan.com`;

const MetadataDisplay = ({ tokenInfo }: MetadataDisplayProps) => {
  const { contractType, metadata, tokenAddress, tokenId, tokenCreator } =
    tokenInfo;

  const { attributes, ...data } = metadata;

  return (
    <ul className={styles.list}>
      {!!tokenAddress && (
        <li className={styles.item}>
          <div className={styles.itemKey}>Token address</div>
          <div className={styles.splitter}></div>
          <a
            className={`${styles.itemValue} ${styles.itemLink}`}
            target="_blank"
            rel="noreferrer"
            href={`${BSC_SCAN_BASE_URL}/address/${tokenAddress}`}
          >
            {addressFormatter(tokenAddress)}
          </a>
        </li>
      )}
      <li className={styles.item}>
        <div className={styles.itemKey}>Token id</div>
        <div className={styles.splitter}></div>
        <div className={styles.itemValue}>{tokenId}</div>
      </li>
      <li className={styles.item}>
        <div className={styles.itemKey}>Token standard</div>
        <div className={styles.splitter}></div>
        <div className={styles.itemValue}>{contractType as string}</div>
      </li>
      {!!tokenCreator && (
        <li className={styles.item}>
          <div className={styles.itemKey}>Creator</div>
          <div className={styles.splitter}></div>
          <a
            className={`${styles.itemValue} ${styles.itemLink}`}
            target="_blank"
            rel="noreferrer"
            href={`${BSC_SCAN_BASE_URL}/address/${tokenCreator}`}
          >
            {addressFormatter(tokenCreator)}
          </a>
        </li>
      )}
      {Object.entries(data).map(([key, value]) => {
        if (!(typeof value === 'string' || typeof value === 'number'))
          return null;

        return (
          <li className={styles.item} key={key}>
            <div className={styles.itemKey}>{key}</div>
            <div className={styles.splitter}></div>
            {typeof value === 'string' && value.startsWith('http') ? (
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className={styles.itemValue}
              >
                {value}
              </a>
            ) : (
              <div className={styles.itemValue}>{value}</div>
            )}
          </li>
        );
      })}
      {attributes && !!Object.keys(attributes).length && (
        <>
          <div className={styles.properties}>Properties</div>
          {Object.entries(attributes).map(([key, value]) => {
            return (
              <li className={styles.item} key={key}>
                <div className={styles.itemKey}>
                  {value.trait_type ? value.trait_type : 'Property'}
                </div>
                <div className={styles.splitter}></div>
                <div className={styles.itemValue}>{value.value}</div>
              </li>
            );
          })}
        </>
      )}
    </ul>
  );
};

export default MetadataDisplay;
