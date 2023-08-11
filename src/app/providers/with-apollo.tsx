import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  makeVar,
} from '@apollo/client';
import { createNetworkStatusNotifier } from 'react-apollo-network-status';

import { alertState } from 'entities/alert/model';
import { auctionState } from 'entities/auction';
import { viewerVar } from 'entities/viewer';
import { wrongNetworkState } from 'features/auth/wrong-network/model';
import { creatingState } from 'features/create-auction';
import { setViewport } from 'shared/lib/viewportAdaptation';

const { link, useApolloNetworkStatus } = createNetworkStatusNotifier();

function GlobalLoadingIndicator() {
  const status = useApolloNetworkStatus();

  return null;
}

export const globalLoading = makeVar<boolean>(true);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        alert: {
          read() {
            return alertState();
          },
        },
        viewer: {
          read() {
            return viewerVar();
          },
        },
        creating: {
          read() {
            return creatingState();
          },
        },
        auction: {
          read() {
            return auctionState();
          },
        },
        wrongNetwork: {
          read() {
            return wrongNetworkState();
          },
        },
        viewportWidth: {
          read() {
            return setViewport();
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  // uri: import.meta.env.VITE_SERVER_URI + '/graphql',
  link: link.concat(
    createHttpLink({ uri: import.meta.env.VITE_SERVER_URI + '/graphql' }),
  ),
  cache,
});

export const withApollo = (component: () => React.ReactNode) => () =>
  (
    <ApolloProvider client={client}>
      {/* <GlobalLoadingIndicator /> */}
      {component()}
    </ApolloProvider>
  );
