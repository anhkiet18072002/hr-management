import { BadRequestException, Injectable } from '@nestjs/common'
import { AccountRole, Prisma } from '@prisma/client'
import { CreateAccountRoleDto } from 'src/account-role/dto/create-account-role.dto'
import { AccountService } from 'src/account/account.service'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { RoleService } from 'src/role/role.service'

export const AccountRoleSelect: Prisma.AccountRoleSelect = {
   ...baseSelect,
   account: {
      select: {
         id: true,
         username: true,
         email: true,
         password: true
      }
   },
   role: {
      select: {
         id: true,
         key: true,
         name: true,
         description: true
      }
   }
}

@Injectable()
export class AccountRoleService extends BaseService {
   defaultSelect: Prisma.AccountRoleSelect = AccountRoleSelect

   defaultSearchFields?: string[] = [
      'account.email',
      'account.username',
      'account.firstName',
      'account.middleName',
      'account.lastName',
      'role.name',
      'role.key'
   ]

   constructor(
      readonly prisma: PrismaService,
      readonly accountService: AccountService,
      readonly roleService: RoleService
   ) {
      super(prisma.accountRole)
   }

   override async create(dto: CreateAccountRoleDto): Promise<AccountRole> {
      const role = await this.roleService.findOne(dto.roleId)
      if (!role) {
         throw new BadRequestException(
            `Role with ID: ${dto.roleId} does not exist or has been remove`
         )
      }

      const account = await this.accountService.findOne(dto.accountId)
      if (!account) {
         throw new BadRequestException(
            `The account with ID: ${dto.accountId} does not exist or has been remove`
         )
      }

      return super.create(dto)
   }
}
