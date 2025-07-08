import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   Query
} from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { QueryRoleDto } from './dto/query-role.dto'
import { ApiOperation } from '@nestjs/swagger'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { Permission } from 'src/core/decorator/permission.decorator'
import { PERMISSIONS } from 'src/core/constant'

@Swagger('Role')
@Controller('role')
export class RoleController {
   constructor(private readonly roleService: RoleService) {}

   @ApiOperation({ summary: 'Create a new role' })
   @Post()
   create(@Body() createRoleDto: CreateRoleDto) {
      return this.roleService.create(createRoleDto)
   }

   @ApiOperation({ summary: 'Get all roles' })
   // @Permission({ AND: [PERMISSIONS.CORE_ADMIN, PERMISSIONS.CORE_BASIC] })
   @Get()
   findAll(@Query() query: QueryRoleDto) {
      return this.roleService.findAll(query)
   }

   @ApiOperation({ summary: 'Get role by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.roleService.findOne(id)
   }

   @ApiOperation({ summary: 'Update role by its ID' })
   @Patch(':id')
   update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
      return this.roleService.update(id, updateRoleDto)
   }

   @ApiOperation({ summary: 'Delete role by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.roleService.remove(id)
   }
}
