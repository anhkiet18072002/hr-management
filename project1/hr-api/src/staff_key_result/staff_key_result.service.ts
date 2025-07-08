import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateStaffKeyResultDto } from './dto/create-staff_key_result.dto'
import { UpdateStaffKeyResultDto } from './dto/update-staff_key_result.dto'
import { baseSelect, BaseService } from 'src/core/base.service'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateBaseDto } from 'src/core/dto/update-base.dto'

@Injectable()
export class StaffKeyResultService extends BaseService {
   defaultSelect: Prisma.StaffKeyResultSelect = {
      ...baseSelect,
      staffId: true,
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
      keyResultId: true,
      keyResult: {
         select: {
            id: true,
            name: true,
            value: true,
            deadline: true,
            type: true,
            percent: true,
            numberData: true,
            booleanData: true,
            percentData: true,
            objectiveId: true
         }
      },
      isComplete: true,
      currentValue: true
   }
   defaultSearchFields?: string[]

   constructor(private readonly prisma: PrismaService) {
      super(prisma.staffKeyResult)
   }

   override async update(
      id: string,
      dto: UpdateStaffKeyResultDto
   ): Promise<any> {
      const staffKeyResult = await this.prisma.staffKeyResult.findUnique({
         where: { id },
         include: {
            keyResult: {
               include: {
                  numberData: true,
                  percentData: true,
                  booleanData: true
               }
            }
         }
      })

      if (!staffKeyResult) {
         throw new BadRequestException(
            `The staffKeyResult with ID: ${id} does not exist or has been removed`
         )
      }

      const objective = await this.prisma.objective.findFirst({
         where: {
            staffId: staffKeyResult.staffId,
            keyResults: {
               some: { id: staffKeyResult.keyResultId }
            }
         },
         include: {
            keyResults: true
         }
      })

      if (!objective) {
         throw new BadRequestException(
            `Objective related to this staffKeyResult not found`
         )
      }

      // === Tính toán trạng thái hoàn thành ===
      let shouldBeComplete = false
      const { type, numberData, percentData } = staffKeyResult.keyResult

      if (type === 'NUMBER' && numberData?.target) {
         shouldBeComplete = dto.currentValue === numberData.target
      }

      if (type === 'PERCENT' && percentData?.targetPercent) {
         shouldBeComplete = dto.currentValue === percentData.targetPercent
      }

      if (type === 'BOOLEAN') {
         shouldBeComplete = dto.currentValue === 1
      }

      // === Cập nhật staffKeyResult ===
      await this.prisma.staffKeyResult.update({
         where: { id },
         data: {
            isComplete: shouldBeComplete,
            currentValue: dto.currentValue
         }
      })

      const relatedKeyResultIds = objective.keyResults.map((kr) => kr.id)

      const staffKeyResults = await this.prisma.staffKeyResult.findMany({
         where: {
            staffId: staffKeyResult.staffId,
            keyResultId: { in: relatedKeyResultIds }
         },
         include: {
            keyResult: {
               include: {
                  numberData: true,
                  percentData: true,
                  booleanData: true
               }
            }
         }
      })

      // === Tính lại progress ===
      let totalProgress = 0

      for (const skr of staffKeyResults) {
         const kr = skr.keyResult
         let percent = 0

         if (kr.type === 'NUMBER' && kr.numberData?.target) {
            percent = skr.currentValue / kr.numberData.target
         } else if (kr.type === 'PERCENT' && kr.percentData?.targetPercent) {
            percent = skr.currentValue / kr.percentData.targetPercent
         } else if (kr.type === 'BOOLEAN') {
            percent = skr.currentValue === 1 ? 1 : 0
         }

         const percentOfKeyResult = percent * kr.value

         await this.prisma.keyResult.update({
            where: { id: skr.keyResultId },
            data: { percent: percentOfKeyResult }
         })

         totalProgress += percent * kr.value
      }

      await this.prisma.objective.update({
         where: { id: objective.id },
         data: { progress: totalProgress }
      })

      return await this.prisma.staffKeyResult.findUnique({
         where: { id },
         select: this.defaultSelect
      })
   }
}
