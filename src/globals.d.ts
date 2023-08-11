import EventEmitter from 'events';

import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    EventEmitter: typeof EventEmitter;
  }
}
