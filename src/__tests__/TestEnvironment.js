// @flow
import type {
  EthereumAddress,
  PrivateKey,
} from 'eth'

import {
  type EthereumClient,
  HttpEthereumClient,
} from 'eth/Client'

import TestEthereumClient from './TestEthereumClient'

const argv = require('minimist')(process.argv)

export type TestEnvironment = {
  createClient: () => EthereumClient,
  accounts: Array<EthereumAddress>,
  privateKeys: Array<PrivateKey>,
  supportsSigning: boolean,
}

const testRPCEnvironment: TestEnvironment = {
  createClient: () => new TestEthereumClient({
    seed: 'ethly',
  }),
  accounts: [
    '0xf6213c73f3275d02b177d9088c056635bb0a8270',
    '0xacf88b0e6b3ba8d044ca485f9b1eb2e9b7a681bb',
    '0x3638f188a608ac326a9501432397b4ea599d49b2',
    '0xf0b96268786a58612b6322e4304b976f42f88a3d',
    '0xf98f4367cb5844e51eabc1ddef3735b8826782dd',
    '0x542ab101bf560b12fcea5701a14bc69a62087290',
    '0x66f3f35065c1bb7e25db7f1da2467e9fdd856372',
    '0x940fa8d58511728cc12e6d95c0c13fd64c95616b',
    '0x05352c414b415f1864b37e9b2f2aaee7aa0a92c6',
    '0x39016bcc69ca8188eae6b3e330af38e3023c332a',
  ],
  privateKeys: [
    'af8b9e8fbe9bec2641445e2e764bfe7b3943d19e55a2722582d6da963069241e',
    'e0167a126826bdb7e7a0069032488e039be13c028f120ef25689e76c6a620c14',
    '64e6fe54d09ab6b38aff7ae0ce5756ef3272ac03f9f76778771343f6abac6864',
    'eaf0ceb30b5fa858ff1ae2c82705b1c6883b55831b1b14a61e9e428fc6bd611c',
    '258f23646624e698e424261a7309bf5dfeae2204607d62b6a76bee8b016bd9ad',
    '6db921ecef75cb71071637388eab57a179dfe184b98aa9acd5aa3cba4f3ba4fb',
    'f89c14441a4b6c448f374b101d53c629007c2c665d42176d3529120dbda666f7',
    '2a3af98c1945e4d8a1dc34432ee0ec394aaee10223ae4b7a98bf93766e495b21',
    'a5437d5aa47e8f263d0701240f0272c890bd4602342fa883c723d649585876e6',
    'fb8b57dd731ab950f215f98aefa52fbcbe814b36e8770bbf11859dde1d4f30a7',
  ],
  supportsSigning: false,
}

const devRPCEnvironment: TestEnvironment = {
  createClient: () => new HttpEthereumClient('http://localhost:8545'),
  accounts: [
    '0x4Eb84C3BCc0c1C4Cc9d90b415D9FE42532Fe9AdC',
  ],
  privateKeys: [
    '0x875f96badbdd3d6c575bd8db6a41bf42a1dc079f8f4b811caa0823ed5322fb24',
  ],
  supportsSigning: true,
}

const currentEnvironment: TestEnvironment = argv.rpc
  ? devRPCEnvironment
  : testRPCEnvironment

export default currentEnvironment
