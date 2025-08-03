import { BaseEntityType } from '@/app/types/common.type'
import { AccountType } from './account.type'
import { RoleType } from './role.type'

export type AccountRoleType = BaseEntityType & {
   id: string
   accountId: string
   roleId: string

   account: AccountType
   role: RoleType
}
