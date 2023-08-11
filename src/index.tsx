import { createRoot } from 'react-dom/client';

import { polyfillNode } from 'polyfils';

import App from 'app';
import 'shared/i18n';

polyfillNode();

const elem = document.getElementById('root');

if (elem) {
  const root = createRoot(elem);

  root.render(<App />);
}
