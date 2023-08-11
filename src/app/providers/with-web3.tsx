import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';
import { provider } from 'web3-core';

function getLibrary(provider: provider) {
  return new Web3(provider);
}

export const withWeb3 = (component: () => React.ReactNode) => () =>
  <Web3ReactProvider getLibrary={getLibrary}>{component()}</Web3ReactProvider>;
