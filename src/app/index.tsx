import { Routing } from 'pages';

import { withProviders } from './providers';

import './styles/globals.scss';

const App = () => {
  return <Routing />;
};

export default withProviders(App);
