import { Body, Controller, Post } from '@nestjs/common'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto'
import { RoleAssignmentService } from './role-assignment.service'
import { ApiOperation } from '@nestjs/swagger'

@Swagger('Role assignment')
@Controller('role-assignment')
export class RoleAssignmentController {
   constructor(private readonly roleAssignmentService: RoleAssignmentService) {}

   @ApiOperation({
      summary:
         'Assign role to an account. This endpoint will clear all previous roles and assign all as new'
   })
   @Post()
   create(@Body() dto: CreateRoleAssignmentDto) {
      return this.roleAssignmentService.create(dto)
   }
}
