import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
const RPC_URLS: Record<number, string> = {
  1: import.meta.env.VITE_RPC_URL_1 as string,
  4: import.meta.env.VITE_RPC_URL_4 as string,
};

export const injected = new InjectedConnector({});

export const walletconnect = new WalletConnectConnector({
  // rpc: { 97: 'https://data-seed-prebsc-1-s1.binance.org:8545/' },
  rpc: {
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    56: 'https://bsc-dataseed1.binance.org/',
  },
  qrcode: true,
});
