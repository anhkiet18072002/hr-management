import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { baseSelect, BaseService } from 'src/core/base.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateSkillAssignmentDto } from './dto/create-skill-assignment.dto'
import { StaffService } from 'src/staff/staff.service'
import { UpdateSkillAssignmentDto } from './dto/update-skill-assignment.dto'

@Injectable()
export class SkillAssignmentService extends BaseService {
   defaultSelect: Prisma.SkillAssignmentSelect = {
      ...baseSelect,
      staff: {
         select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            accountId: true
         }
      },
      skill: {
         select: {
            id: true,
            name: true,
            description: true
         }
      },
      level: {
         select: {
            id: true,
            name: true,
            description: true
         }
      },
      yearOfExp: true,
      primary: true
   }

   defaultSearchFields?: string[] = [
      'skill.name',
      'staff.firstName',
      'staff.middleName',
      'staff.lastName'
   ]

   constructor(
      readonly prisma: PrismaService,
      readonly staffService: StaffService
   ) {
      super(prisma.skillAssignment)
   }

   async create(dto: CreateSkillAssignmentDto & { userId: string }) {
      const staff = await this.prisma.staff.findUnique({
         where: { id: dto.staffId }
      })

      if (!staff) {
         throw new BadRequestException(
            `Staff with ID: ${dto.staffId} does not exist or has been removed`
         )
      }

      const skill = await this.prisma.skill.findUnique({
         where: { id: dto.skillId }
      })

      if (!skill) {
         throw new BadRequestException(
            `Skill with ID: ${dto.skillId} does not exist or has been removed`
         )
      }

      const skillAssignment = await this.prisma.skillAssignment.create({
         data: {
            staff: {
               connect: { id: staff.id }
            },
            skill: {
               connect: { id: dto.skillId }
            },
            yearOfExp: dto.yearOfExp,
            level: {
               connect: { id: dto.levelId }
            },
            primary: dto.primary
         }
      })

      return skillAssignment
   }
}
