export interface Meta {
  name: string;
  description: string;
  image: string;
  stringedMeta: string;
  contractType: string;
  tokenUri: string;
  tokenCreator: string;
  socials?: { network: string; link: string };
  web3info?: { scan: string; ipfs: string };
  supports_erc?: string[];
}
