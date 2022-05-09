import { AccountMeta, Keypair } from '@solana/web3.js'
import { decodeSplInstruction } from './splParser'

export type InstructionData<T> = {
  name: string
  accounts: Map<string, AccountMeta>
  data: T
}

const main = () => {
  const dataBuffer = Buffer.from('0300ca9a3b00000000', 'hex')
  const data = decodeSplInstruction<string>(
    [
      {
        isSigner: false,
        isWritable: false,
        pubkey: Keypair.generate().publicKey,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: Keypair.generate().publicKey,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: Keypair.generate().publicKey,
      },
    ],
    dataBuffer,
  )
  console.log('data', data)
}
main()
