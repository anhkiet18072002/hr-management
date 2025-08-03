import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateObjectiveDto } from './dto/create-objective.dto'
import { UpdateObjectiveDto } from './dto/update-objective.dto'
import { baseSelect, BaseService } from 'src/core/base.service'
import { KeyResultType, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateBaseDto } from 'src/core/dto/update-base.dto'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

@Injectable()
export class ObjectiveService extends BaseService {
   defaultSelect: Prisma.ObjectiveSelect = {
      ...baseSelect,
      name: true,
      description: true,
      startDate: true,
      endDate: true,
      progress: true,
      keyResults: {
         select: {
            id: true,
            name: true,
            value: true,
            type: true,
            deadline: true,
            percent: true,
            numberData: {
               select: {
                  target: true
               }
            },
            percentData: {
               select: {
                  targetPercent: true
               }
            }
         }
      },
      staff: {
         select: {
            id: true,
            account: {
               select: {
                  username: true,
                  email: true
               }
            }
         }
      }
   }
   defaultSearchFields?: string[] = ['name']

   constructor(readonly prisma: PrismaService) {
      super(prisma.objective)
   }

   override async create(dto: CreateObjectiveDto): Promise<any> {
      if (dto.keyResults && dto.keyResults.length > 0) {
         let sum = 0
         for (const keyResult of dto.keyResults) {
            sum += keyResult.value
            if (sum > 1) {
               throw new BadRequestException(
                  `Tổng value của các key result không được vượt quá 100%`
               )
            }
         }
      }

      const objective = await this.prisma.objective.create({
         data: {
            name: dto.name,
            startDate: dto.startDate,
            endDate: dto.endDate,
            description: dto.description,
            progress: dto.progress,
            staff: { connect: { id: dto.staffId } },
            ...(dto.keyResults && {
               keyResults: {
                  create: dto.keyResults.map((kr) => {
                     const base = {
                        name: kr.name,
                        type: kr.type as KeyResultType, // ép kiểu enum
                        value: kr.value,
                        deadline: new Date(kr.deadline)
                     }

                     if (kr.type === 'NUMBER') {
                        return {
                           ...base,
                           numberData: {
                              create: {
                                 target: kr.numberData?.target ?? 0
                              }
                           }
                        }
                     }

                     if (kr.type === 'BOOLEAN') {
                        return {
                           ...base,
                           booleanData: {
                              create: {}
                           }
                        }
                     }

                     if (kr.type === 'PERCENT') {
                        return {
                           ...base,
                           percentData: {
                              create: {
                                 targetPercent:
                                    kr.percentData?.targetPercent ?? 0
                              }
                           }
                        }
                     }

                     throw new BadRequestException(
                        `Invalid key result type: ${kr.type}`
                     )
                  })
               }
            })
         },
         select: this.defaultSelect
      })

      if (objective) {
         const keyResults = await this.prisma.keyResult.findMany({
            where: { objectiveId: objective.id }
         })

         if (keyResults && keyResults.length > 0) {
            for (const keyResult of keyResults) {
               await this.prisma.staffKeyResult.create({
                  data: {
                     staffId: dto.staffId,
                     keyResultId: keyResult.id,
                     isComplete: false,
                     currentValue: 0
                  }
               })
            }
         }
      }

      return await this.prisma.objective.findUnique({
         where: { id: objective.id }
      })
   }

   override async update(id: string, dto: UpdateObjectiveDto): Promise<any> {
      const objective = await this.prisma.objective.findUnique({
         where: { id },
         include: { keyResults: true }
      })
      if (!objective) {
         throw new BadRequestException(`
             The objective with ID: ${id} does not exist or has been removed
          `)
      }

      if (!dto.keyResults) {
         await this.prisma.keyResult.deleteMany({
            where: {
               objectiveId: id
            }
         })
      }

      if (dto.keyResults && dto.keyResults.length > 0) {
         let sum = 0
         for (const keyResult of dto.keyResults) {
            sum += keyResult.value
            if (sum > 1) {
               throw new BadRequestException(
                  `Toggle value of key must be less than 100%`
               )
            }
         }

         const existingKeys = objective.keyResults.map((item) => item.id)
         const incomingKeys = dto.keyResults.map((item) => item.id)

         const keysToDelete = existingKeys.filter(
            (id) => !incomingKeys.includes(id)
         )

         const keysToUpdate = existingKeys.filter((id) =>
            incomingKeys.includes(id)
         )

         const keysToCreate = dto.keyResults.filter((item) => !item.id)

         if (keysToUpdate.length > 0) {
            for (const keyId of keysToUpdate) {
               const updatedKey = dto.keyResults.find((kr) => kr.id === keyId)
               if (updatedKey) {
                  await this.prisma.keyResult.update({
                     where: { id: updatedKey.id },
                     data: {
                        name: updatedKey.name,
                        type: updatedKey.type as KeyResultType,
                        value: updatedKey.value,
                        deadline: new Date(updatedKey.deadline),
                        objectiveId: id,
                        ...(updatedKey.type === 'NUMBER' && {
                           numberData: {
                              upsert: {
                                 update: {
                                    target: updatedKey.numberData?.target ?? 0
                                 },
                                 create: {
                                    target: updatedKey.numberData?.target ?? 0
                                 }
                              }
                           }
                        }),
                        ...(updatedKey.type === 'PERCENT' && {
                           percentData: {
                              upsert: {
                                 update: {
                                    targetPercent:
                                       updatedKey.percentData?.targetPercent ??
                                       0
                                 },
                                 create: {
                                    targetPercent:
                                       updatedKey.percentData?.targetPercent ??
                                       0
                                 }
                              }
                           }
                        })
                     }
                  })
               }
            }
         }

         if (keysToDelete.length > 0) {
            await this.prisma.keyResult.deleteMany({
               where: { objectiveId: id, id: { in: keysToDelete } }
            })

            await this.prisma.staffKeyResult.deleteMany({
               where: {
                  staffId: dto.staffId,
                  keyResult: { id: { in: keysToDelete } }
               }
            })
         }

         if (keysToCreate.length > 0) {
            for (const key of keysToCreate) {
               const createdKey = await this.prisma.keyResult.create({
                  data: {
                     name: key.name,
                     type: key.type as KeyResultType,
                     value: key.value,
                     deadline: new Date(key.deadline),
                     objectiveId: id,
                     ...(key.type === 'NUMBER' && {
                        numberData: {
                           create: {
                              target: key.numberData?.target ?? 0
                           }
                        }
                     }),
                     ...(key.type === 'BOOLEAN' && {
                        booleanData: {
                           create: {}
                        }
                     }),
                     ...(key.type === 'PERCENT' && {
                        percentData: {
                           create: {
                              targetPercent: key.percentData?.targetPercent ?? 0
                           }
                        }
                     })
                  }
               })

               await this.prisma.staffKeyResult.create({
                  data: {
                     staffId: dto.staffId,
                     keyResultId: createdKey.id,
                     isComplete: false,
                     currentValue: 0
                  }
               })
            }
         }
      }

      const staffKeyResults = await this.prisma.staffKeyResult.findMany({
         where: { keyResult: { objectiveId: id } },
         include: {
            keyResult: {
               include: {
                  numberData: true,
                  booleanData: true,
                  percentData: true
               }
            }
         }
      })

      let sum = 0
      if (staffKeyResults && staffKeyResults.length > 0) {
         for (const staffKeyResult of staffKeyResults) {
            if (staffKeyResult.keyResult.type === 'NUMBER') {
               const keyProgress =
                  staffKeyResult.currentValue /
                  staffKeyResult.keyResult.numberData.target
               const weightedProgress =
                  keyProgress * staffKeyResult.keyResult.value

               sum += weightedProgress
            }
            if (staffKeyResult.keyResult.type === 'BOOLEAN') {
               if (staffKeyResult.currentValue === 1) {
                  sum += staffKeyResult.keyResult.value
               }
            }
            if (staffKeyResult.keyResult.type === 'PERCENT') {
               const keyProgress =
                  staffKeyResult.currentValue /
                  staffKeyResult.keyResult.percentData.targetPercent
               const weightedProgress =
                  keyProgress * staffKeyResult.keyResult.value

               sum += weightedProgress
            }
         }
      }

      return await this.prisma.objective.update({
         where: { id },
         data: {
            name: dto.name,
            description: dto.description,
            startDate: dto.startDate,
            endDate: dto.endDate,
            progress: sum
         },
         select: this.defaultSelect
      })
   }
}
