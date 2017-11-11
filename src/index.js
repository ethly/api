// @flow
import SmartContract, {
  Link,
} from './model'
import type {
  HashTag,
  EthereumAddress,
} from './model'

/**
  Add a link to the contract

  @param contractAddress - The adress of the contract with links
  @param link - The link itself
*/
export function addLink(
  contractAddress: EthereumAddress,
  link: Link,
): Promise<Link> {
  return Promise.resolve(
    link,
  )
}

/**
  Get full information about a deployed contract

  @param contractAddress - The address of the contract
*/
export function getContract(
  contractAddress: EthereumAddress,
): Promise<SmartContract> {
  return Promise.reject(
    new Error('Not Implemented Yet'),
  )
}

/**
  Get all links by a specified address

  @param contractAddress - The address of the contract
*/
export function getAllLinks(
  contractAddress: EthereumAddress,
): Promise<Array<Link>> {
  return Promise.resolve([])
}

/**
  Get links by hashtag in a specific contract

  @param contractAddress - The address of the contract
  @param hashtag - The hashtag to search links with
*/
export function getLinksByHashTag(
  contractAddress: EthereumAddress,
  hashtag: HashTag,
): Promise<Array<Link>> {
  return Promise.resolve([])
}

/**
  Get links submitted by the user

  @param contractAddress - The addres of the contract
  @param userAddress - The address of the user
*/
export function getLinksByUser(
  contractAddress: EthereumAddress,
  userAddress: EthereumAddress,
): Promise<Array<Link>> {
  return Promise.resolve([])
}
