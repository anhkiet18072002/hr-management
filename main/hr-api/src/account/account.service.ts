import { Injectable } from '@nestjs/common'
import {
   Account,
   AccountRole,
   Permission,
   Prisma,
   Role,
   RoleFeaturePermission
} from '@prisma/client'
import { hash } from 'argon2'
import { CreateAccountDto } from 'src/account/dto/create-account.dto'
import { UpdateAccountDto } from 'src/account/dto/update-account.dto'
import { baseSelect, BaseService } from 'src/core/base.service'
import { ROLES } from 'src/core/constant'
import { PrismaService } from 'src/prisma/prisma.service'

export const AccountSelect: Prisma.AccountSelect = {
   ...baseSelect,
   accountRoles: {
      select: {
         role: {
            select: {
               key: true,
               name: true,
               description: true,
               roleFeaturePermissions: {
                  where: {
                     feature: null
                  },

                  select: {
                     permission: true
                  }
               }
            }
         }
      }
   },
   email: true,
   firstName: true,
   lastName: true,
   middleName: true,
   username: true
}

@Injectable()
export class AccountService extends BaseService {
   readonly defaultSelect: Prisma.AccountSelect = AccountSelect
   readonly defaultSearchFields?: string[] = [
      'firstName',
      'lastName',
      'middleName',
      'email',
      'username'
   ]

   constructor(readonly prisma: PrismaService) {
      super(prisma.account)
   }

   override async create(dto: CreateAccountDto): Promise<Account> {
      return await super.create({ ...dto, password: await hash(dto.password) })
   }

   override async update(id: string, dto: UpdateAccountDto): Promise<Account> {
      let { password } = dto
      if (password) {
         password = await hash(password)
      }

      return await super.update(id, { ...dto, password })
   }

   async findOneByEmail(email: string) {
      const account = await this.prisma.account.findUnique({
         where: {
            email
         },
         select: { ...this.defaultSelect, password: true }
      })

      return account
   }

   async isAdmin(
      account: Account & {
         accountRoles: AccountRole &
         {
            role: Role & {
               roleFeaturePermissions: RoleFeaturePermission & { permission: Permission }[]
            }
         }[]
      }
   ): Promise<boolean> {
      const { accountRoles } = account
      if (accountRoles && accountRoles?.length) {
         for (const accountRole of accountRoles) {
            const { role } = accountRole
            const { roleFeaturePermissions } = role
            for (const rfp of roleFeaturePermissions) {
               if (rfp.permission.key === ROLES.CORE_ADMIN) return true
            }
         }
      }

      return false
   }
}
