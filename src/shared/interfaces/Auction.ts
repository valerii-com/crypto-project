import { Bid } from './Bid';
import { Token } from './Token';
import { Wei } from './Wei';

export interface Auction {
  bids: Bid[];
  initialPrice: Wei;
  reward: Wei;
  token: Token;
  status: number;
  ID: number;
  initiator: string;
  timeframe: number;
}
