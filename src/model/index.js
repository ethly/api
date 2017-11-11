// @flow

export type HashTag = string;
export type EthereumAddress = string;

/**
  Represents a link, stored in the contract
*/
export class Link {
  label: string;
  url: string;
  hashtags: Array<HashTag>;
  description: string;

  constructor(
    url: string,
    label: string,
    description: string,
    hashtags: Array<HashTag>,
  ) {
    this.url = url
    this.label = label
    this.description = description
    this.hashtags = hashtags
  }
}

/**
  Represents a smart contract that stores links
*/
export default class SmartContract {
  developerWallet: EthereumAddress;
  links: Array<Link>;

  constructor(
    developerWallet: EthereumAddress,
    links: Array<Link>,
  ) {
    this.developerWallet = developerWallet
    this.links = links
  }
}
