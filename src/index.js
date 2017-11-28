// @flow
import Web3, {
  type Web3Instance,
  type SmartContract,
} from 'web3'
import LinkStorage from 'ethly-smart-contract'

import {
  Link,
  StoredLink,
} from 'model'

import type {
  EthereumClient,
  EthereumAddress,
  Password,
  TransactionDraft,
  AddLinkTransaction,
  SignedTransaction,
  TransactionReceipt,
} from 'model/Ethereum'

// export type * from 'model/Ethereum';

export default class EthlyApi {
  web3: Web3Instance;
  contractAddress: EthereumAddress;
  instance: SmartContract;

  constructor(
    client: EthereumClient,
    contractAddress: EthereumAddress,
  ) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(
      client.address,
      client.timeout,
      client.username,
      client.password,
    ))
    this.contractAddress = contractAddress
    this.instance = new this.web3.eth.Contract(LinkStorage.abi, contractAddress)
  }

  /**
    Add a link to the contract

    @param link - The link itself
  */
  addLink(
    link: Link,
    draft: TransactionDraft,
    password: Password,
  ): Promise<TransactionReceipt> {
    const transaction = this.getAddLinkTransaction(link, draft)
    return this.web3.eth.accounts.signTransaction(
      transaction,
      password
    ).then(signed => {
      return this.executeSignedTransaction(
        signed.rawTransaction
      )
    })
  }

  getAddLinkTransaction(
    link: Link,
    draft: TransactionDraft,
  ): AddLinkTransaction {
    const data: string = this.instance.methods.addLink(
      link.url,
      link.label,
      link.description,
      link.getMergedHashtags(),
    ).encodeABI()
    return {
      from: draft.from,
      to: this.contractAddress,
      value: 0,
      gas: draft.gas,
      gasPrice: draft.gasPrice,
      data: data,
      nonce: draft.nonce,
    }
  }

  executeSignedTransaction(
    transaction: SignedTransaction,
  ): Promise<TransactionReceipt> {
    return this.web3.eth.sendSignedTransaction(transaction)
  }

  getLinksCount(): Promise<number> {
    return this.instance.methods.getLinksCount().call()
  }

  getLinkAt(index: number): Promise<?StoredLink> {
    if (index < 0) {
      return Promise.reject(
        new Error('Negative index is not allowed')
      )
    }
    return this.instance.methods.getLinkAt(index).call().then(
      result => {
        if (!result.exists) {
          return null
        }
        return new StoredLink(
          result.url,
          result.label,
          result.description,
          result.hashtags.split('#'),
          result.timestamp,
        )
      }
    )
  }

  /**
    Get all links by a specified address

    @param contractAddress - The address of the contract
  */
  getAllLinks(): Promise<Array<StoredLink>> {
    return this.getLinksSince(0)
  }

  /**
    Get links by a specified address

    @param contractAddress - The address of the contract
  */
  getLinksSince(
    since: number,
  ): Promise<Array<StoredLink>> {
    return this.getLinksCount()
      .then(count => {
        if (since >= count) {
          return Promise.resolve([])
        }
        const indices = [
          ...Array(count - since).keys(),
        ].map(ind => ind + since)
        return Promise.all(indices.map(index => this.getLinkAt(index)))
      })
      .then(links => links.filter(Boolean))
  }
}
