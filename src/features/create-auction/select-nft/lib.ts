import { Meta } from 'shared/interfaces/Meta';

export type TokenResponse = {
  metadata: Meta;
  contract_type: string;
  token_uri: string;
};

export const getTokenStandart = (erc: string): 721 | 1155 => {
  if (Number(erc.substring(3)) === 721) return 721;
  else return 1155;
};
