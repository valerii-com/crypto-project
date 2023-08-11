import axios from 'axios';

import { TokenResponse } from 'features/create-auction/select-nft/lib';

import ERC721_ABI from './ABIes/ERC721-ABI.json';
import AUCTION_ABI from './ABIes/Auction-ABI.json';

class BlockchainService {
  private library;
  private contractAddress: string;
  private AuctionContract: any;

  constructor(library: any) {
    this.library = library;
    this.contractAddress = import.meta.env.VITE_AUCTION_CONTRACT_ADDRESS || '';
    this.AuctionContract = new library.eth.Contract(
      AUCTION_ABI,
      this.contractAddress,
    );
  }

  async getTokenInfo(
    address: string,
    tokenID: number,
    account: string,
  ): Promise<TokenResponse | undefined> {
    const res = await axios.get(
      `https://deep-index.moralis.io/api/v2/nft/${address}/${tokenID}?chain=bsc%20testnet&format=decimal`,
      {
        headers: {
          'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY,
        },
      },
    );

    const { data } = await res;

    if (data.error) {
      throw new Error(data.error_message);
    }

    if (data.owner_of !== account.toLowerCase()) {
      throw new Error('The token does not own by this account');
    }
    data.metadata = JSON.parse(data.metadata);

    return data;
  }

  async checkApproved(
    owner: string,
    address: string,
    tokenId: number,
  ): Promise<boolean> {
    const contract = new this.library.eth.Contract(ERC721_ABI, address);
    const approvedAddress = await contract.methods
      .getApproved(tokenId)
      .call({ from: owner });

    return approvedAddress.toLowerCase() === this.contractAddress.toLowerCase();
  }

  async approveToken(account: string, address: string, tokenId: number) {
    const contract = new this.library.eth.Contract(ERC721_ABI, address);

    return await contract.methods
      .approve(this.contractAddress, tokenId)
      .send({ from: account });
  }

  async getMinBidStep() {
    const { AuctionContract } = this;

    const value: number = await AuctionContract.methods.minBidStep().call();

    return value;
  }

  async createNewAuction(
    account: string,
    initialReward: number,
    token: { address: string; id: number },
    amount?: number | false,
  ) {
    const { library, AuctionContract } = this;

    if (amount) {
      await AuctionContract.methods
        .createNewERC1155(
          token.address,
          token.id,
          amount,
          library.utils.toWei(`${initialReward}`),
        )
        .send({
          from: account,
          value: library.utils.toWei(`${initialReward}`),
        });
    } else {
      await AuctionContract.methods
        .createNewERC721(
          token.address,
          token.id,
          library.utils.toWei(`${initialReward}`),
        )
        .send({
          from: account,
          value: library.utils.toWei(`${initialReward}`),
        });
    }
  }

  async placeNewBid(account: string, auctionID: number, bidValue: number) {
    const { library, AuctionContract } = this;

    await AuctionContract.methods.placeBid(auctionID).send({
      from: account,
      value: library.utils.toWei(`${bidValue}`),
    });
  }

  async close(account: string, id: number) {
    await this.AuctionContract.methods.close(id).send({
      from: account,
    });
  }

  async cancel(account: string, id: number) {
    await this.AuctionContract.methods.cancel(id).send({
      from: account,
    });
  }

  async countReward(
    id: number,
  ): Promise<{ winnerReward: string; toSeller: string }> {
    return await this.AuctionContract.methods.countReward(id).call();
  }
}

export const useBlockchain = (library: any): BlockchainService =>
  library && new BlockchainService(library);
