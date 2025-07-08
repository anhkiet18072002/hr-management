import { Module } from '@nestjs/common'
import { RoleAssignmentService } from './role-assignment.service'
import { RoleAssignmentController } from './role-assignment.controller'
import { AccountService } from 'src/account/account.service'
import { RoleService } from 'src/role/role.service'
import { AccountRoleService } from 'src/account-role/account-role.service'

@Module({
   controllers: [RoleAssignmentController],
   providers: [
      RoleAssignmentService,
      AccountService,
      RoleService,
      AccountRoleService
   ]
})
export class RoleAssignmentModule {}
