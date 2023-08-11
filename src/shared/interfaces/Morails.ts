export interface MoralisResponse {
  result: (MoralisToken & { metadata: MoralisMetadata })[];
  cursor: string;
}

export interface MoralisMetaResponse {
  data: MoralisMetadata;
}

export interface MoralisToken {
  amount: number;
  block_number: number;
  block_number_minted: number;
  contract_type: string;
  last_metadata_sync: string;
  last_token_uri_sync: null;
  metadata: MoralisMetadata & string;
  minter_address: string;
  name: string;
  owner_of: string;
  possible_spam: boolean;
  symbol: string;
  token_address: string;
  token_hash: string;
  token_id: number;
  token_uri: string;
}

export interface MoralisMetadata {
  name: string;
  description: string;
  external_url: string;
  category_ids: string[];
  quantity: number;
  royalties: number;
  attributes: null;
  image: string;
  folder: string;
}
