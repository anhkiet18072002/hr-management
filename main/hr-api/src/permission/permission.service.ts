import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePermissionDto } from './dto/create-permission.dto'

@Injectable()
export class PermissionService extends BaseService {
   defaultSelect: Prisma.PermissionSelect = {
      ...baseSelect,
      key: true
   }
   defaultSearchFields?: string[]

   constructor(readonly prisma: PrismaService) {
      super(prisma.permission)
   }

   override async create(dto: CreatePermissionDto): Promise<any> {
      const key = `${dto.entity}.${dto.action}`?.toUpperCase()

      const permission = await this.prisma.permission.findUnique({
         where: { key }
      })

      if (permission) {
         throw new BadRequestException(
            `Permission with key: ${key} has been exist. Please choose other key`
         )
      }

      return await super.create({ key })
   }
}
