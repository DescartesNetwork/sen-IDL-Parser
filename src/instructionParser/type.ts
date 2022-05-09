import { AccountMeta } from '@solana/web3.js'

export type InstructionData<T> = {
  name: string
  accounts: Map<string, AccountMeta>
  data: T
}
