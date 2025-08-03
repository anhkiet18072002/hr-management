import { Module } from '@nestjs/common'
import { AccountService } from 'src/account/account.service'
import { AccountRoleController } from './account-role.controller'
import { AccountRoleService } from './account-role.service'
import { RoleService } from 'src/role/role.service'

@Module({
   controllers: [AccountRoleController],
   providers: [AccountRoleService, RoleService, AccountService]
})
export class AccountRoleModule {}
