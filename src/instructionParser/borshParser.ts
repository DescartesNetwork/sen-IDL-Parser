import { BorshInstructionCoder, Idl } from '@project-serum/anchor'
import { AccountMeta } from '@solana/web3.js'
import { InstructionData } from './type'

export const decodeInstruction = <T>(
  accountMetas: AccountMeta[],
  data: Buffer,
  idl: Idl,
): InstructionData<T> | null => {
  const borshInstructionCoder = new BorshInstructionCoder(idl)
  const decodeData = borshInstructionCoder.decode(data)
  if (!decodeData) return null
  const instruction = idl.instructions.find(
    (ins) => ins.name === decodeData?.name,
  )
  if (!instruction) return null

  const accounts = new Map<string, AccountMeta>()
  instruction.accounts.map((inst, idx) => {
    const accountMeta = accountMetas[idx]
    if (!accountMeta) throw new Error(`Invalid Account Meta index ${idx}`)
    accounts.set(inst.name, accountMeta)
  })

  return {
    accounts,
    name: decodeData.name,
    data: decodeData.data as T,
  }
}
