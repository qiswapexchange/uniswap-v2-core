import { Contract, Wallet } from 'ethers'
import { Web3Provider } from 'ethers/providers'
import { deployContract } from 'ethereum-waffle'

import { expandTo18Decimals } from './utilities'

import ERC20 from '../../build/ERC20.json'
import UniswapV2Factory from '../../build/UniswapV2Factory.json'
import UniswapV2Pair from '../../build/UniswapV2Pair.json'

interface FactoryFixture {
  factory: Contract
  token0: Contract
  token1: Contract
}

const overrides = {
  gasLimit: 9999999
}

export async function factoryFixture(_: Web3Provider, [wallet]: Wallet[]): Promise<FactoryFixture> {
  const factory = await deployContract(wallet, UniswapV2Factory, [wallet.address], overrides)
  const token0 = await deployContract(wallet, ERC20, [expandTo18Decimals(10000), "TOKA", "Token A"], overrides)
  const token1 = await deployContract(wallet, ERC20, [expandTo18Decimals(10000), "TOKB", "Token B"], overrides)
  return { factory, token0, token1 }
}

interface PairFixture {
  factory: Contract
  token0: Contract
  token1: Contract
  pair: Contract
}

export async function pairFixture(provider: Web3Provider, [wallet]: Wallet[]): Promise<PairFixture> {
  // const { factory } = await factoryFixture(provider, [wallet])
  const factory = await deployContract(wallet, UniswapV2Factory, [wallet.address], overrides)

  const tokenA = await deployContract(wallet, ERC20, [expandTo18Decimals(10000), "TOKA", "Token A"], overrides)
  const tokenB = await deployContract(wallet, ERC20, [expandTo18Decimals(10000), "TOKB", "Token B"], overrides)

  await factory.createPair(tokenA.address, tokenB.address, overrides)
  const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
  const pair = new Contract(pairAddress, JSON.stringify(UniswapV2Pair.abi), provider).connect(wallet)

  const token0Address = (await pair.token0()).address
  const token0 = tokenA.address === token0Address ? tokenA : tokenB
  const token1 = tokenA.address === token0Address ? tokenB : tokenA

  return { factory, token0, token1, pair }
}
