import { BadRequestException, Injectable } from '@nestjs/common'
import { AccountRoleService } from 'src/account-role/account-role.service'
import { AccountService } from 'src/account/account.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto'

@Injectable()
export class RoleAssignmentService {
   constructor(
      readonly prisma: PrismaService,
      readonly accountService: AccountService,
      readonly accountRoleService: AccountRoleService
   ) {}

   async create(dto: CreateRoleAssignmentDto) {
      // Verify account
      const account = await this.accountService.findOne(dto.accountId)
      if (!account) {
         throw new BadRequestException(
            `The user with account ID: ${dto.accountId} does not exist or has been removed`
         )
      }

      // TODO: Use role service instead
      const roles = await this.prisma.role.findMany({
         where: {
            id: {
               in: dto.roleId
            }
         },
         select: {
            id: true
         }
      })

      if (roles && roles.length < dto.roleId?.length) {
         // Find the missing and throw error
         dto.roleId?.map((id) => {
            if (roles?.filter((role) => role.id === id).length <= 0) {
               throw new BadRequestException(
                  `The role with ID: ${id} does not exist or has been removed`
               )
            }
         })
      }

      // Delete previous roles
      let deleteAccountRoles = await this.prisma.accountRole.findMany({
         where: {
            accountId: dto.accountId
         }
      })

      // Create new roles
      const result = await Promise.all(
         roles?.map((role) => {
            return this.prisma.accountRole.create({
               data: {
                  accountId: dto.accountId,
                  roleId: role.id
               },
               select: {
                  role: {
                     select: {
                        id: true,
                        key: true,
                        name: true
                     }
                  }
               }
            })
         })
      )

      // Proceed deletion only when result is good
      if (result) {
         await Promise.all(
            deleteAccountRoles?.map((accountRole) => {
               return this.accountRoleService.remove(accountRole.id)
            })
         )
      }

      return { data: result }
   }
}
