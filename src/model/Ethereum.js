// @flow

export type EthereumAddress = string;
export type Password = string;

export type BigNumber = number | string;

export type TransactionDraft = {
  from: EthereumAddress,
  value ?: BigNumber,
  gas ?: BigNumber,
  gasPrice ?: BigNumber,
  nonce ?: number,
};

export type AddLinkTransaction = {
  from: EthereumAddress,
  to: EthereumAddress,
  value: 0,
  data: string,
  gas ?: BigNumber,
  gasPrice ?: BigNumber,
  nonce ?: number,
}

export type SignedTransaction = string;

export type TransactionReceipt = {
  transactionHash: string,
  from: EthereumAddress,
  to: EthereumAddress,
  gasUsed: number,
};

export type EthereumClient = {
  address: string,
  timeout ?: number,
  username ?: string,
  password ?: string,
}
