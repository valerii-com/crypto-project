import { makeVar } from '@apollo/client';

import { CreatingState } from 'shared/interfaces/CreatingState';

export const creatingState = makeVar<CreatingState>({});
