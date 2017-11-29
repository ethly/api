// @flow

import type {
  EthereumAddress,
  TransactionReceipt,
  TransactionDraft,
} from 'eth'

import EthlyApi, {
  Link,
  StoredLink,
} from 'index'

import TestEnvironment from './TestEnvironment'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000

describe('Ethly Public API', () => {
  const client = TestEnvironment.createClient()
  const accounts = TestEnvironment.accounts
  const privateKeys = TestEnvironment.privateKeys
  const account = accounts[0]
  const privateKey = privateKeys[0]

  let nonce = 0
  let api: EthlyApi

  beforeEach(() => client.getWeb3Instance().eth.getTransactionCount(account)
    .then(count => {
      nonce = Math.max(nonce, count)
      return EthlyApi
        .deployContract(client, {
          from: account,
          gas: 2100000,
          nonce: nonce++,
        })
    })
    .then(ethlyApi => {
      api = ethlyApi
      return api
    })
  )

  it('deploys contract', () => {
    expect(api).toBeDefined()
  })

  it('can be created from contract address', () => {
    const address = api.getContractAddress()
    return EthlyApi.forContract(client, address)
      .then(newApi => {
        expect(newApi).toBeDefined()
        return newApi
      })
  })

  it('is empty when initialized', () => api.getLinksCount()
    .then(count => {
      expect(count).toBe('0')
      return count
    })
  )

  it('returns null if link not found', () => api.getLinkAt(1)
    .then(link => {
      expect(link).toBeNull()
      return link
    })
  )

  it('adds links from unlocked account', () => {
    return checkAddLinks((l, t) => api.addLink(l, t), account)
  })

  if (TestEnvironment.supportsSigning) {
    it('adds links from locked account, signed by password', () => {
      return checkAddLinks((l, t) => api.addLinkPasswordSigned(l, t, privateKey), account)
    })
  }

  function addLinks(
    adder: (Link, TransactionDraft) => Promise<TransactionReceipt>,
    links: Array<Link>,
    account: EthereumAddress,
  ): Promise<Array<TransactionReceipt>> {
    return Promise.all(
      links.map(link => adder(
        link, {
          from: account,
          gas: 2100000,
          nonce: nonce++,
        })
      ))
      .then(receipt => {
        expect(receipt).toBeDefined()
        return receipt
      })
  }

  function checkAddLinks(
    adder: (Link, TransactionDraft) => Promise<TransactionReceipt>,
    account: EthereumAddress,
  ): Promise<Array<StoredLink>> {
    const links = [
      new Link('foo', 'bar', 'zap', []),
      new Link('a', 'b', 'c', ['d', 'e', 'f']),
      new Link('', '', '', []),
    ]
    const sort = list => list.sort((a, b) => a.url < b.url ? 1 : -1)
    sort(links)
    return addLinks(adder, links, account)
      .then(_ => api.getLinksCount())
      .then(count => {
        expect(count).toBe(links.length.toString())
        return api.getAllLinks()
      })
      .then(storedLinks => {
        sort(storedLinks)
        for (let i = 0; i < links.length; i++) {
          let link: Link = links[i]
          let stored: StoredLink = storedLinks[i]

          expect(stored.url).toBe(link.url)
          expect(stored.label).toBe(link.label)
          expect(stored.description).toBe(link.description)
          expect(stored.hashtags).toEqual(link.hashtags)
          expect(stored.timestamp).toBeGreaterThan(0)
        }
        return storedLinks
      })
  }
})
