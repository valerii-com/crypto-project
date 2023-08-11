import { useEffect, useState } from 'react';
import axios from 'axios';

import { useWeb3React } from '@web3-react/core';

import {
  MoralisMetaResponse,
  MoralisMetadata,
  MoralisResponse,
  MoralisToken,
} from 'shared/interfaces/Morails';

const CHAIN_NAME = `bsc${import.meta.env.MODE !== 'prod' ? ' testnet' : ''}`;

export const useAddressTokens = (): MoralisToken[] | undefined => {
  const { account } = useWeb3React();
  const [tokens, setTokens] = useState<MoralisToken[] | undefined>();
  const [cursor, setCursor] = useState<string | undefined>('');

  async function fetchMetadata(cursor: string | undefined) {
    try {
      const { data, status } = await axios.get<MoralisResponse>(
        `https://deep-index.moralis.io/api/v2/${account}/nft/`,
        {
          params: {
            chain: CHAIN_NAME,
            format: 'decimal',
            normalizeMetadata: false,
            limit: 15,
            cursor,
          },
          headers: {
            accept: 'application/json',
            'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY,
          },
        },
      );

      if (status === 200) {
        const parsedResult = await Promise.all(
          data.result.map(async (token) => {
            if (token.metadata)
              return {
                ...token,
                metadata: JSON.parse(token.metadata) as MoralisMetadata,
              };

            try {
              const req = await axios.get<MoralisMetaResponse>(token.token_uri);

              return {
                ...token,
                metadata: req.data,
              };
            } catch (error) {
              console.log(error);
            }

            return token;
          }),
        );

        const parsedTokens = parsedResult.filter(
          (res) => res.metadata,
        ) as MoralisToken[];

        setTokens((tokens) =>
          tokens ? [...tokens, ...parsedTokens] : parsedTokens,
        );

        data.cursor && setCursor(data.cursor);
      }
    } catch (ex) {
      console.error(ex);

      setTokens([]);
    }
  }

  useEffect(() => {
    account && fetchMetadata(cursor);
  }, [account, cursor]);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        cursor
      ) {
        console.log(cursor);
        await fetchMetadata(cursor);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cursor]);

  return tokens;
};
