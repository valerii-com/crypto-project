import { makeVar, useQuery } from '@apollo/client';

import { GET_VIEWPORT } from 'shared/api/graphql/state-cache';

export const setViewport = makeVar<number>(window.innerWidth);

export const useAdaptation = () => {
  const { data } = useQuery(GET_VIEWPORT);

  return data.viewportWidth;
};
