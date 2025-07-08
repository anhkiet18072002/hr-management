import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete
} from '@nestjs/common'
import { RoleFeaturePermissionService } from './role-feature-permission.service'
import { CreateRoleFeaturePermissionDto } from './dto/create-role-feature-permission.dto'
import { UpdateRoleFeaturePermissionDto } from './dto/update-role-feature-permission.dto'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { ApiOperation } from '@nestjs/swagger'

@Swagger('Role feature permission')
@Controller('role-feature-permission')
export class RoleFeaturePermissionController {
   constructor(
      private readonly roleFeaturePermissionService: RoleFeaturePermissionService
   ) {}

   @ApiOperation({ summary: 'Create new feature role permission relation' })
   @Post()
   create(@Body() dto: CreateRoleFeaturePermissionDto) {
      return this.roleFeaturePermissionService.create(dto)
   }

   @ApiOperation({ summary: 'Create new feature role permission relation' })
   @Get()
   findAll() {
      return this.roleFeaturePermissionService.findAll()
   }

   @ApiOperation({ summary: 'Create new feature role permission relation' })
   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.roleFeaturePermissionService.findOne(id)
   }

   @ApiOperation({ summary: 'Create new feature role permission relation' })
   @Patch(':id')
   update(
      @Param('id') id: string,
      @Body() dto: UpdateRoleFeaturePermissionDto
   ) {
      return this.roleFeaturePermissionService.update(id, dto)
   }

   @ApiOperation({ summary: 'Create new feature role permission relation' })
   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.roleFeaturePermissionService.remove(id)
   }
}
