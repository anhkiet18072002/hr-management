import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateKeyResultDto } from './dto/create-key_result.dto'
import { UpdateKeyResultDto } from './dto/update-key_result.dto'
import { baseSelect, BaseService } from 'src/core/base.service'
import { KeyResultType, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'
import { UpdateBaseDto } from 'src/core/dto/update-base.dto'

@Injectable()
export class KeyResultService extends BaseService {
   defaultSelect: Prisma.KeyResultSelect = {
      ...baseSelect,
      name: true,
      type: true,
      value: true,
      deadline: true,
      percent: true,
      objective: {
         select: {
            id: true,
            name: true,
            description: true,
            progress: true,
            startDate: true,
            endDate: true
         }
      },

      objectiveId: true,
      numberData: true,
      booleanData: true,
      percentData: true
   }
   defaultSearchFields?: string[]

   constructor(private readonly prisma: PrismaService) {
      super(prisma.keyResult)
   }

   override async create(dto: CreateKeyResultDto): Promise<any> {
      const objective = await this.prisma.objective.findUnique({
         where: { id: dto.objectiveId }
      })
      if (!objective) {
         throw new BadRequestException(`
             The objective with ID: ${dto.objectiveId} does not exist or has been removed
          `)
      }

      const keyResult = await this.prisma.keyResult.create({
         data: {
            name: dto.name,
            type: dto.type,
            value: dto.value,
            deadline: new Date(dto.deadline),
            objectiveId: dto.objectiveId,
            percent: 0,
            ...(dto.type === 'NUMBER' && {
               numberData: {
                  create: {
                     target: dto.numberData.target
                  }
               }
            }),
            ...(dto.type === 'PERCENT' && {
               percentData: {
                  create: {
                     targetPercent: dto.percentData.targetPercent
                  }
               }
            })
         }
      })

      return await this.prisma.staffKeyResult.create({
         data: {
            staffId: dto.staffId,
            keyResultId: keyResult.id,
            isComplete: false,
            currentValue: 0
         },
         include: {
            staff: {
               select: {
                  account: {
                     select: {
                        email: true,
                        username: true
                     }
                  }
               }
            },
            keyResult: {
               select: {
                  id: true,
                  name: true,
                  value: true,
                  deadline: true,
                  type: true,
                  numberData: true,
                  percentData: true,
                  objectiveId: true
               }
            }
         }
      })
   }

   override async remove(id: string): Promise<any> {
      const keyResult = await this.prisma.keyResult.findUnique({
         where: { id }
      })
      if (!keyResult) {
         throw new BadRequestException(`
             The keyResult with ID: ${id} does not exist or has been removed
          `)
      }

      const objective = await this.prisma.objective.findUnique({
         where: { id: keyResult.objectiveId }
      })

      if (!objective) {
         throw new BadRequestException(`
             The objective with ID: ${objective.id} does not exist or has been removed
          `)
      }

      const updateProgress = objective.progress - keyResult.percent

      await this.prisma.objective.update({
         where: { id: objective.id },
         data: { progress: updateProgress }
      })

      return await this.prisma.keyResult.delete({ where: { id } })
   }
}
