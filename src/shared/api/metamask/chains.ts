import type { AddEthereumChainParameter } from '@web3-react/types';

const BNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'tBNB',
  symbol: 'tBNB',
  decimals: 18,
};

interface BasicChainInformation {
  chainId: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

export const CHAINS: Record<string, BasicChainInformation> = {
  BSC: {
    chainId: '0x38',
  },
  BSC_TEST: {
    chainId: '0x61',
  },
};

export const CHAINS_EXTENDED: Record<string, ExtendedChainInformation> = {
  BSC: {
    ...CHAINS['BSC'],
    chainName: `Binance Smart Chain Mainnet`,
    blockExplorerUrls: ['https://bscscan.com'],
    nativeCurrency: BNB,
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
  },
  BSC_TEST: {
    ...CHAINS['BSC_TEST'],
    chainName: `Binance Smart Chain Testnet`,
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    nativeCurrency: BNB,
  },
};
