import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox.css';
import { omit } from 'lodash-es';

import { Token } from 'shared/interfaces/Token';
import { PhotoPlaceholder } from 'shared/ui/photo-placeholder';
import { TokenInfo } from 'shared/lib/useTokenInfo';

import MetadataDisplay from '../metadata-display';

import styles from './styles.module.scss';

type propTypes = { token: Token };

const BSC_SCAN_BASE_URL = `https://${
  import.meta.env.MODE !== 'prod' && 'testnet.'
}bscscan.com/token`;
const FIELDS_TO_OMIT = ['name', 'description', 'image', 'external_url'];

export const TokenPreview = ({ token }: propTypes) => {
  const { address, id } = token;
  const { t } = useTranslation();
  const [fullDescription, setFullDescription] = useState(false);

  const tokenInfo = useMemo<TokenInfo>(() => {
    let parsedMeta;
    if (token?.meta?.stringedMeta) {
      parsedMeta = JSON.parse(token.meta.stringedMeta);
    }

    return {
      tokenAddress: address,
      tokenId: id,
      name: token.meta?.name,
      description: token.meta?.description,
      image: token.meta?.image,
      metadata: omit(parsedMeta, FIELDS_TO_OMIT),
      ...(token?.meta?.contractType === 'ERC721' ||
      token?.meta?.contractType === 'ERC1155'
        ? {
            contractType: token.meta.contractType,
          }
        : { contractType: 'ERC721' }),
      tokenCreator: token.meta?.tokenCreator,
      tokenUri: token.meta?.tokenUri,
    };
  }, []);

  if (!token.meta) return null;

  const descriptionSubStr = () => {
    if (!token.meta.description) return;
    if (!token.meta) return '...';
    const str = `${token.meta.description}`;

    if (token.meta.description.length > 225) {
      return `${str.substring(0, 225)}... `;
    } else {
      setFullDescription(true);

      return token.meta.description;
    }
  };

  return (
    <div className={styles.root}>
      <PhotoPlaceholder
        className="photo"
        src={token.meta.image}
        dataFancybox="gallery"
        dataSrc={`${import.meta.env.VITE_SERVER_URI}/${token.meta.image}`}
      />
      <h2>{token.meta.name}</h2>
      {fullDescription ? (
        <p>{token.meta.description}</p>
      ) : (
        <p>{descriptionSubStr()}</p>
      )}
      {fullDescription || (
        <div
          className={styles.readmore}
          onClick={() => setFullDescription(true)}
        >
          {t('preview.readmore')}
        </div>
      )}
      <MetadataDisplay tokenInfo={tokenInfo} />
      <div className={styles.seeOn}>
        <a
          href={BSC_SCAN_BASE_URL + `/${address}?a=${id}`}
          target="_blank"
          rel="noreferrer"
          className={styles.outerLink}
        >
          See on BscScan
        </a>
        {tokenInfo.tokenUri && (
          <a
            className={styles.outerLink}
            href={tokenInfo.tokenUri}
            target="_blank"
            rel="noreferrer"
          >
            See IPFS metadata
          </a>
        )}
      </div>
    </div>
  );
};
