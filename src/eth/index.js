// @flow

export * from 'eth/Client'

export type EthereumAddress = string;
export type PrivateKey = string;

export type BigNumber = number | string;

export type TransactionDraft = {
  from: EthereumAddress,
  value ?: BigNumber,
  gas ?: BigNumber,
  gasPrice ?: BigNumber,
  nonce ?: number,
};

export type WithReceiver = {
  to: EthereumAddress,
}

export type AddLinkTransaction = TransactionDraft & WithReceiver

export type SignedTransaction = string;

export type TransactionReceipt = {
  transactionHash: string,
  from: EthereumAddress,
  to: EthereumAddress,
  gasUsed: number,
};
