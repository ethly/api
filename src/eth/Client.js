// @flow

import Web3, {
  type Web3Instance,
} from 'web3'

/**
  Client of the Ethereum blockchain.
  Incapsulates connection to web3.js
*/
export interface EthereumClient {

  /**
    Get instance of web.js
  */
  getWeb3Instance(): Web3Instance;
}

/**
  Unsafe HTTP connection
*/
export class HttpEthereumClient implements EthereumClient {
  instance: Web3Instance

  constructor(
    address: string,
    timeout: ? number = null,
    username: ? string = null,
    password: ? string = null
  ) {
    this.instance = new Web3(new Web3.providers.HttpProvider(
      address,
      timeout,
      username,
      password,
    ))
  }

  getWeb3Instance(): Web3Instance {
    return this.instance
  }
}
