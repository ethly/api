// @flow
import {
  type Web3Instance,
  type SmartContract,
  type MethodCall,
} from 'web3'
import LinkStorage from 'ethly-smart-contract'

import {
  Link,
  StoredLink,
} from 'model'

import type {
  EthereumClient,
  EthereumAddress,
  PrivateKey,
  TransactionDraft,
  AddLinkTransaction,
  SignedTransaction,
  TransactionReceipt,
} from 'eth'

import * as eth from 'eth'

export {
  eth,
  Link,
  StoredLink,
}

/**
  API of ethly. Incapsulates interaction with smart contract
*/
export default class EthlyApi {
  web3: Web3Instance;
  contract: SmartContract;

  constructor(
    web3: Web3Instance,
    contractInstance: SmartContract,
  ) {
    this.web3 = web3
    this.contract = contractInstance
  }

  /**
    Create API for specified contract address

    @param client           Client of Ethereum, see `eth/Client`
    @param contractAddress  Address of the contract
  */
  static forContract(
    client: EthereumClient,
    contractAddress: EthereumAddress,
  ): Promise<EthlyApi> {
    const web3 = client.getWeb3Instance()
    return Promise.resolve(new EthlyApi(
      web3,
      new web3.eth.Contract(LinkStorage.abi, contractAddress),
    ))
  }

  /**
    Deploy contract and create API

    @param client     Client of Ethereum, see `eth/clients`
    @param draft      Draft of transaction for deployment of smart contract
  */
  static deployContract(
    client: EthereumClient,
    draft: TransactionDraft,
  ): Promise<EthlyApi> {
    const web3 = client.getWeb3Instance()
    const contract = new web3.eth.Contract(LinkStorage.abi)
    return contract.deploy({
      data: LinkStorage.bytecode,
    }).send(draft)
      .then(instance => new EthlyApi(
        web3,
        instance,
      ))
  }

  /**
    Get address of the contract API interacts with
  */
  getContractAddress(): EthereumAddress {
    return this.contract.options.address
  }

  /**
    Adds link, if API is connected to the node with unlocked account

    @param link   Link to add
    @param draft  Draft of link creation transaction
  */
  addLink(
    link: Link,
    draft: TransactionDraft,
  ): Promise<TransactionReceipt> {
    return this._getAddLinkCall(link).send(draft)
  }

  /**
    Add a link to the contract, signs transaction with private key

    @param link         Link to add
    @param draft        Draft of link creation transaction
    @param privateKey   Private key to sign with
  */
  addLinkPasswordSigned(
    link: Link,
    draft: TransactionDraft,
    privateKey: PrivateKey,
  ): Promise<TransactionReceipt> {
    const transaction = this.createAddLinkTransaction(link, draft)
    return this.web3.eth.accounts.signTransaction(
      transaction,
      privateKey,
    ).then(signed => {
      return this.executeSignedTransaction(
        signed.rawTransaction
      )
    })
  }

  /**
    Creates transaction that adds link. Note that transaction should be
    signed and then executed by `executeSignedTransaction`

    @param link         Link to add
    @param draft        Draft of link creation transaction
  */
  createAddLinkTransaction(
    link: Link,
    draft: TransactionDraft,
  ): AddLinkTransaction {
    const data: string = this._getAddLinkCall(link).encodeABI()
    return {
      from: draft.from,
      to: this.getContractAddress(),
      value: 0,
      gas: draft.gas,
      gasPrice: draft.gasPrice,
      data: data,
      nonce: draft.nonce,
    }
  }

  /**
    Executes transaction that were previously signed

    @param transaction Signed transcation
  */
  executeSignedTransaction(
    transaction: SignedTransaction,
  ): Promise<TransactionReceipt> {
    return this.web3.eth.sendSignedTransaction(transaction)
  }

  /**
    Get number of links, stored in contract
  */
  getLinksCount(): Promise<number> {
    return this.contract.methods.getLinksCount().call()
  }

  /**
    Get link at specified position

    @param index  Position of link in contract
  */
  getLinkAt(index: number): Promise<?StoredLink> {
    if (index < 0) {
      return Promise.reject(
        new Error('Negative index is not allowed')
      )
    }
    return this.contract.methods.getLinkAt(index).call().then(
      result => {
        if (!result.exists) {
          return null
        }
        return new StoredLink(
          result.url,
          result.label,
          result.description,
          result.hashtags ? result.hashtags.split('#') : [],
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
    Get links by a specified address since specified index

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

  _getAddLinkCall(
    link: Link,
  ): MethodCall {
    return this.contract.methods.addLink(
      link.url,
      link.label,
      link.description,
      link.getMergedHashtags(),
    )
  }
}
