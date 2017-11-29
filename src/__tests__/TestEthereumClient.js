// @flow

import Web3, {
  type Web3Instance,
} from 'web3'

import TestRPC, {
  type TestRPCParams,
} from 'ethereumjs-testrpc'

import {
  type EthereumClient,
} from 'eth/Client'

export default class TestEthereumClient implements EthereumClient {
  instance: Web3Instance

  constructor(options: TestRPCParams) {
    this.instance = new Web3(TestRPC.provider(options))
  }

  getWeb3Instance(): Web3Instance {
    return this.instance
  }
}
