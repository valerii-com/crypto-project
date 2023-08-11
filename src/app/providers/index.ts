import compose from 'compose-function';

import { withWeb3 } from './with-web3';
import { withRouter } from './with-router';
import { withApollo } from './with-apollo';

export const withProviders = compose(withApollo, withRouter, withWeb3);
