import { Module } from '@nestjs/common'
import { AccountService } from './account.service'
import { AccountController } from './account.controller'
import { AccountRoleService } from 'src/account-role/account-role.service'
import { RoleService } from 'src/role/role.service'

@Module({
   controllers: [AccountController],
   providers: [AccountService]
})
export class AccountModule {}
