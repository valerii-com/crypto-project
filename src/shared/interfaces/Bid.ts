import { Wei } from './Wei';

export interface Bid {
  bidPrice: Wei;
  bidder: string;
  bank: string;
  date: number;
  endIn: number;
  minNext: Wei;
  transactionHash: string;
}
