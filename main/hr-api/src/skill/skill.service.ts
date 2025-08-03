import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { FileStorageService } from 'src/file-storage/file-storage.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateSkillDto } from './dto/update-skill.dto'

@Injectable()
export class SkillService extends BaseService {
   defaultSelect: Prisma.SkillSelect = {
      ...baseSelect,
      name: true,
      description: true,
      thumbnail: true
   }

   defaultSearchFields?: string[] = ['name', 'description']

   constructor(
      readonly prisma: PrismaService,
      readonly fileStorageService: FileStorageService
   ) {
      super(prisma.skill)
   }

   override async update(id: string, dto: UpdateSkillDto): Promise<any> {
      const skill = await this.prisma.skill.findUnique({
         where: { id },
         select: this.defaultSelect
      })
      if (!skill) {
         throw new BadRequestException(
            `The skill with ID: ${id} does not exist or has been removed`
         )
      }

      if (dto.thumbnailId) {
         if (skill.thumbnail) {
            await this.fileStorageService.remove(skill.thumbnail.id)
         }
      }

      return await this.prisma.skill.update({
         where: { id },
         data: {
            name: dto.name,
            description: dto.description,
            thumbnail: dto.thumbnailId
               ? { connect: { id: dto.thumbnailId } }
               : undefined
         }
      })
   }
}
