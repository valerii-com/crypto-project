import { Meta } from './Meta';

export interface Token {
  address: string;
  id: number;
  owner: string;
  meta: Meta;
  amount?: number;
}
