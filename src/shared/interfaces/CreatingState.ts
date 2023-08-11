import { Token } from './Token';

export interface CreatingState {
  activeItem?: Token;
  isApproved?: boolean;
  erc?: 721 | 1155;
}
