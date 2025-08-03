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
import { PermissionService } from './permission.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { QueryPermissionDto } from './dto/query-permission.dto'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { ApiOperation } from '@nestjs/swagger'
import { Permission } from 'src/core/decorator/permission.decorator'
import { PERMISSIONS } from 'src/core/constant'

@Swagger('Permission')
@Controller('permission')
export class PermissionController {
   constructor(private readonly permissionService: PermissionService) {}

   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @ApiOperation({ summary: 'Create a new permission' })
   @Post()
   create(@Body() createPermissionDto: CreatePermissionDto) {
      return this.permissionService.create(createPermissionDto)
   }

   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @ApiOperation({ summary: 'Get all permissions' })
   @Get()
   findAll(@Query() query: QueryPermissionDto) {
      return this.permissionService.findAll(query)
   }

   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @ApiOperation({ summary: 'Get permission by its ID' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.permissionService.findOne(id)
   }

   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @ApiOperation({ summary: 'Update permission by its ID' })
   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() updatePermissionDto: UpdatePermissionDto
   ) {
      return this.permissionService.update(id, updatePermissionDto)
   }

   @Permission({ AND: [PERMISSIONS.CORE_ADMIN] })
   @ApiOperation({ summary: 'Delete permission by its ID' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.permissionService.remove(id)
   }
}
