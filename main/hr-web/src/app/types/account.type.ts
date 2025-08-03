import { BaseEntityType } from '@/app/types/common.type'

export type AccountType = BaseEntityType & {
   username: string
   email: string
   firstName: string
   lastName: string
   middleName?: string
}
