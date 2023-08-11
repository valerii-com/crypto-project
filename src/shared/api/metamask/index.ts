import { Provider, ProviderRpcError } from '@web3-react/types';

import { CHAINS, CHAINS_EXTENDED } from './chains';

export interface MetamaskServiceInterface {
  requestNetworkChange: (provider: Provider) => void;
  requestNetworkAdd: (provider: Provider) => void;
}

const BSC_CHAIN =
  import.meta.env.MODE === 'prod' ? CHAINS.BSC : CHAINS.BSC_TEST;

const BSC_CHAIN_EXTENDED =
  import.meta.env.MODE === 'prod'
    ? CHAINS_EXTENDED.BSC
    : CHAINS_EXTENDED.BSC_TEST;

const requestNetworkAdd = async (provider: Provider) => {
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [BSC_CHAIN_EXTENDED],
    });
  } catch (error) {
    const typedError = error as ProviderRpcError;
  }
};

const requestNetworkChange = async (provider: Provider) => {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [BSC_CHAIN],
    });
  } catch (error) {
    const typedError = error as ProviderRpcError;
    // No such network found network
    if (typedError.code === 4902) {
      requestNetworkAdd(provider);
    }
  }
};

const MetamaskService: MetamaskServiceInterface = {
  requestNetworkChange,
  requestNetworkAdd,
};

export default MetamaskService;
