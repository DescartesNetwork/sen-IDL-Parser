import { InstructionData } from './index'
import { BorshInstructionCoder, Idl } from '@project-serum/anchor'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { AccountMeta } from '@solana/web3.js'
import { decodeInstruction } from './borshParser'

const INST_CODE_IDX = 0
const BEGIN_DATA_IDX = 1

export const decodeSplInstruction = <T>(
  accountMetas: AccountMeta[],
  data: Buffer,
): InstructionData<T> | null => {
  const borshInstructionCoder = new BorshInstructionCoder(IDL_SPL_TOKEN)
  const instructionCode = Array.from(data)[INST_CODE_IDX]
  const instructionName = SPL_TOKEN_INSTRUCTIONS[instructionCode]

  const sighashLayouts: Map<string, { name: string }> = (
    borshInstructionCoder as any
  ).sighashLayouts
  let prefixHex = ''
  sighashLayouts.forEach((value, key) => {
    if (value.name === instructionName) prefixHex = key
  })

  const wrapBufferData = Buffer.concat([
    bs58.decode(prefixHex),
    data.slice(BEGIN_DATA_IDX, data.length),
  ])

  return decodeInstruction<T>(accountMetas, wrapBufferData, IDL_SPL_TOKEN)
}

const SPL_TOKEN_INSTRUCTIONS: Record<string, string> = {
  0: 'initializeMint',
  1: 'initializeAccount',
  2: 'initializeMultisig',
  3: 'transfer',
  4: 'approve',
  5: 'revoke',
  6: 'setAuthority',
  7: 'mintTo',
  8: 'burn',
  9: 'closeAccount',
  10: 'freezeAccount',
  11: 'thawAccount',
  12: 'transferChecked',
  13: 'approvedChecked',
  14: 'mintToChecked',
  15: 'burnedChecked',
  16: 'InitializeAccount2',
  17: 'syncNative',
  18: 'initializeAccount3',
  19: 'initializeMultisig2',
  20: 'initializeMint2',
}

const IDL_SPL_TOKEN: Idl = {
  version: '0.1.0',
  name: 'spl_token',
  instructions: [
    {
      name: 'transfer',
      accounts: [
        {
          name: 'source',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'destination',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'approve',
      accounts: [
        {
          name: 'source',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'delegate',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [],
  types: [],
  errors: [],
}
