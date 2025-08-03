import { AccountType } from '@/app/types/account.type'

export type LoginResponseType = {
   account: AccountType
   token: {
      access: string
      expiration: number
   }
}
