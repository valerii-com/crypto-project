import { useEffect, useState } from 'react';
import axios from 'axios';

import { omit } from 'lodash-es';

import { MetadataField, objectCleaner } from './objectCreaner';

const CHAIN_NAME = `bsc${import.meta.env.MODE !== 'prod' ? ' testnet' : ''}`;
const FIELDS_TO_OMIT = ['name', 'description', 'image', 'external_url'];

export interface TokenInfo {
  tokenUri: string;
  metadata: Record<string, MetadataField>;
  contractType: 'ERC721' | 'ERC1155';
  tokenAddress: string;
  tokenId: number;
  tokenCreator: string;
}

const defaultInfo: TokenInfo = {
  tokenUri: '',
  tokenAddress: '',
  tokenId: 0,
  contractType: 'ERC721',
  metadata: {},
  tokenCreator: '',
};

export const useTokenInfo = (
  address: string | undefined,
  tokenId: number | string | undefined,
) => {
  const [metadata, setMetadata] = useState<TokenInfo>(defaultInfo);

  useEffect(() => {
    async function fetchMetadata() {
      const options = {
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/nft/${address}/${tokenId}`,
        params: {
          chain: CHAIN_NAME,
          format: 'decimal',
          normalizeMetadata: false,
        },
        headers: {
          accept: 'application/json',
          'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY,
        },
      };
      if (address && tokenId) {
        try {
          const { data, status } = await axios.request(options);
          if (status === 200) {
            const {
              token_uri,
              metadata,
              contract_type,
              token_id,
              token_address,
              minter_address,
            } = data;

            setMetadata({
              contractType: contract_type,
              metadata: omit(
                objectCleaner(JSON.parse(metadata)),
                FIELDS_TO_OMIT,
              ),
              tokenUri: token_uri,
              tokenId: Number(token_id),
              tokenAddress: token_address,
              tokenCreator: minter_address,
            });
          }
        } catch (ex) {
          console.error(ex);
        }
      }
    }
    fetchMetadata();
  }, [address, tokenId]);

  return metadata;
};
