import {
   BadRequestException,
   ConflictException,
   Injectable,
   InternalServerErrorException
} from '@nestjs/common'
import { Account, Prisma, Staff } from '@prisma/client'
import { hash } from 'argon2'
import * as ExcelJS from 'exceljs'
import { Response } from 'express'
import * as fs from 'fs'
import { unlink } from 'fs/promises'
import { AccountSelect, AccountService } from 'src/account/account.service'
import { baseSelect, BaseService } from 'src/core/base.service'
import { FileStorageService } from 'src/file-storage/file-storage.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateStaffDto } from 'src/staff/dto/create-staff.dto'
import * as XLSX from 'xlsx'
import { UpdateStaffDto } from './dto/update-staff.dto'

@Injectable()
export class StaffService extends BaseService {
   readonly defaultSelect: Prisma.StaffSelect = {
      ...baseSelect,
      accountId: true,
      account: {
         select: AccountSelect
      },
      avatar: true,
      jobPosition: {
         select: {
            id: true,
            name: true,
            shortName: true,
            description: true,
            specification: true
         }
      },
      jobLevel: {
         select: {
            id: true,
            name: true,
            description: true
         }
      },
      skillAssignments: {
         include: {
            level: true,
            skill: true
         }
      },
      objectives: {
         select: {
            id: true,
            name: true,
            description: true,
            progress: true,
            startDate: true,
            endDate: true,
            keyResults: {
               select: {
                  id: true,
                  name: true,
                  value: true,
                  type: true,
                  deadline: true,
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
            }
         }
      },
      staffKeyResults: {
         select: {
            id: true,
            currentValue: true,
            isComplete: true,
            keyResultId: true,
            keyResult: {
               select: {
                  id: true,
                  name: true,
                  value: true,
                  type: true,
                  deadline: true,
                  objectiveId: true,
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
            }
         }
      },
      startDate: true,
      endDate: true
   }

   readonly defaultSearchFields?: string[] = [
      'firstName',
      'lastName',
      'middleName',
      'account.email',
      'account.username'
      // 'jobPosition.name',
      // 'jobPosition.shortName'
      // 'jobLevel.name',
      // 'skillAssignments.skill.name',
      // 'skillAssignments.level.name'
   ]

   constructor(
      readonly prisma: PrismaService,
      private accountService: AccountService,
      private readonly fileStorageService: FileStorageService
   ) {
      super(prisma.staff)
   }

   override async create(dto: CreateStaffDto): Promise<Staff> {
      // Validate the input data
      await this.validate(dto as CreateStaffDto)

      const account = await this.accountService.create({
         username: dto.username,
         firstName: dto.firstName,
         lastName: dto.lastName,
         middleName: dto.middleName,
         email: dto.email,
         password: dto.password
      })

      let staff = await this.prisma.staff.findUnique({
         where: {
            accountId: account.id
         },
         select: this.defaultSelect
      })

      if (!staff) {
         staff = await this.prisma.staff.create({
            data: {
               firstName: account.firstName,
               middleName: account.middleName,
               lastName: account.lastName,
               startDate: dto.startDate,
               endDate: dto.endDate,
               account: { connect: { id: account.id } },
               avatar: dto.avatarId
                  ? { connect: { id: dto.avatarId } }
                  : undefined,
               jobPosition: dto.jobPositionId
                  ? { connect: { id: dto.jobPositionId } }
                  : undefined,
               jobLevel: dto.jobLevelId
                  ? { connect: { id: dto.jobLevelId } }
                  : undefined,
               ...(dto.skillAssignments && {
                  skillAssignments: {
                     createMany: {
                        data: dto.skillAssignments
                     }
                  }
               })
            },
            select: this.defaultSelect
         })
      }

      return staff
   }

   override async update(id: string, dto: UpdateStaffDto): Promise<any> {
      const staff = await this.prisma.staff.findUnique({
         where: { id },
         select: this.defaultSelect
      })

      if (!staff) {
         throw new BadRequestException(
            `The staff with ID: ${id} does not exist or has been removed`
         )
      }

      // Validate the input data
      await this.validate({
         ...dto,
         email:
            dto.email && staff.account.email !== dto.email
               ? dto.email
               : undefined,
         username:
            dto.username && staff.account.username !== dto.username
               ? dto.username
               : undefined
      } as UpdateStaffDto)

      if (dto.avatarId) {
         if (staff.avatar) {
            await this.fileStorageService.remove(staff.avatar.id)
         }
      }

      let { password } = dto
      if (password && password !== '********') {
         const passwordHash = await hash(password)
         if (passwordHash !== staff.account.password) {
            password = await hash(password)
         }
      }

      return await this.prisma.staff.update({
         where: { id },
         data: {
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            startDate: dto.startDate,
            endDate: dto.endDate,
            account: {
               update: {
                  firstName: dto.firstName,
                  middleName: dto.middleName,
                  lastName: dto.lastName,
                  email: dto.email,
                  username: dto.username,
                  password
               }
            },
            avatar: dto.avatarId
               ? { connect: { id: dto.avatarId } }
               : undefined,
            jobPosition: dto.jobPositionId
               ? { connect: { id: dto.jobPositionId } }
               : undefined,
            jobLevel: dto.jobLevelId
               ? { connect: { id: dto.jobLevelId } }
               : undefined,
            ...(dto.skillAssignments && {
               skillAssignments: {
                  deleteMany: {},
                  createMany: {
                     data: dto.skillAssignments
                  }
               }
            })
         },
         select: this.defaultSelect
      })
   }

   async updateStaffKeyResult(id: string, dto: UpdateStaffDto): Promise<any> {
      const staff = await this.prisma.staff.findUnique({
         where: { id },

         select: this.defaultSelect
      })
      if (!staff) {
         throw new BadRequestException(
            `The staff with ID: ${id} does not exist or has been removed`
         )
      }

      if (dto.staffKeyResults && dto.staffKeyResults.length > 0) {
         let totalProgress = 0

         for (const skr of dto.staffKeyResults) {
            const keyResult = await this.prisma.keyResult.findUnique({
               where: { id: skr.keyResultId },
               include: { numberData: true, percentData: true }
            })
            const kr = keyResult
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

            await this.prisma.staffKeyResult.update({
               where: { id: skr.id },
               data: {
                  isComplete: skr.isComplete,
                  currentValue: skr.currentValue
               }
            })

            totalProgress += percent * kr.value
         }

         await this.prisma.objective.update({
            where: { id: dto.objectiveId },
            data: { progress: totalProgress }
         })
      }

      return staff
   }

   override async remove(id: string): Promise<any> {
      const staff = await this.prisma.staff.findUnique({
         where: { id },
         select: this.defaultSelect
      })

      if (!staff) {
         throw new BadRequestException(
            `The staff with ID: ${id} does not exist or has been removed`
         )
      }

      if (staff.skillAssignments) {
         await this.prisma.skillAssignment.deleteMany({
            where: { staffId: id }
         })
      }
      await this.prisma.staff.delete({ where: { id } })
      return await this.prisma.account.delete({
         where: { id: staff.accountId }
      })
   }

   private async validate(dto: CreateStaffDto | UpdateStaffDto) {
      // Validate email
      if (dto.email) {
         const account = await this.prisma.account.findUnique({
            where: {
               email: dto.email
            },
            select: {
               email: true,
               staff: true,
               username: true
            }
         })

         if (account) {
            throw new ConflictException(
               `The staff with email: ${dto.email} already exists. Choose another one`
            )
         }
      }

      // Validate username
      if (dto.username) {
         const account = await this.prisma.account.findUnique({
            where: {
               username: dto.username
            }
         })

         if (account) {
            throw new ConflictException(
               `The staff with username: ${dto.username} already exists. Choose another one`
            )
         }
      }

      // Validate job position
      if (dto.jobPositionId) {
         const jobPosition = await this.prisma.jobPosition.findUnique({
            where: { id: dto.jobPositionId }
         })

         if (!jobPosition) {
            throw new BadRequestException(
               `The position with id: ${dto.jobPositionId} does not exist or has been removed`
            )
         }
      }

      // Validate job level
      if (dto.jobLevelId) {
         const jobLevel = await this.prisma.jobLevel.findUnique({
            where: { id: dto.jobLevelId }
         })

         if (!jobLevel) {
            throw new BadRequestException(
               `The level with id: ${dto.jobLevelId} does not exist or has been removed`
            )
         }
      }

      // Validate skill assignments
      if (dto.skillAssignments && dto.skillAssignments.length > 0) {
         const skillIds = dto.skillAssignments.map(
            (skillAssignment) => skillAssignment.skillId
         )

         for await (const id of skillIds) {
            const skill = await this.prisma.skill.findUnique({
               where: {
                  id
               }
            })

            if (!skill) {
               throw new BadRequestException(
                  `The skill with id: ${id} does not exist or has been removed`
               )
            }
         }

         const levelIds = dto.skillAssignments.map(
            (skillAssignment) => skillAssignment.levelId
         )

         for await (const id of levelIds) {
            const level = await this.prisma.skillLevel.findUnique({
               where: {
                  id
               }
            })

            if (!level) {
               throw new BadRequestException(
                  `The skill level with id: ${id} does not exist or has been removed`
               )
            }
         }
      }
   }

   async importFromExcel(file: Express.Multer.File) {
      if (!file || !file.path) {
         throw new BadRequestException('File not found.')
      }

      try {
         // Đọc file từ đường dẫn
         const fileBuffer = fs.readFileSync(file.path)

         // Đọc Excel từ buffer
         const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
         const worksheet = workbook.Sheets[workbook.SheetNames[0]]
         const jsonData = XLSX.utils.sheet_to_json(worksheet)

         const data = (jsonData as any) || jsonData

         // Kiểm tra nếu data không phải là mảng
         if (!Array.isArray(jsonData)) {
            throw new BadRequestException('File Excel incorrect')
         }

         // Xử lý từng nhân viên trong danh sách
         for (const staff of data) {
            try {
               if (
                  !staff.firstName ||
                  !staff.lastName ||
                  !staff.email ||
                  !staff.username ||
                  !staff.startDate ||
                  !staff.password
               ) {
                  console.warn(`Ignore staff lack information:`, staff)
                  continue
               }

               const exitAccount = await this.prisma.account.findUnique({
                  where: { email: staff.email }
               })
               if (exitAccount) continue

               return await this.create({
                  firstName: staff.firstName,
                  lastName: staff.lastName,
                  middleName: staff.middleName || '',
                  startDate: staff.startDate,
                  username: staff.username,
                  email: staff.email,
                  password: staff.password,
                  endDate: staff.endDate
               })
            } catch (err) {
               throw new InternalServerErrorException()
            }
         }
      } catch (err) {
         throw new InternalServerErrorException()
      } finally {
         await unlink(file.path).catch((err) => {
            console.error(`Cannot delete file: ${file.path}`, err)
         })
      }
   }

   async getSampleFileXLSX(res: Response) {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('StaffData')

      worksheet.columns = [
         { header: 'username', key: 'username' },
         { header: 'email', key: 'email' },
         { header: 'password', key: 'password' },
         { header: 'firstName', key: 'firstName' },
         { header: 'middleName', key: 'middleName' },
         { header: 'lastName', key: 'lastName' },
         { header: 'startDate', key: 'startDate' },
         { header: 'endDate', key: 'endDate' },
         { header: 'jobPositionId', key: 'jobPositionId' },
         { header: 'jobLevelId', key: 'jobLevelId' },
         { header: 'avatarId', key: 'avatarId' }
      ]

      worksheet.addRow({
         username: 'john_doe',
         email: 'john.doe@example.com',
         password: 'Apple123@',
         firstName: 'John',
         middleName: 'A.',
         lastName: 'Doe',
         startDate: '2016-09-19T00:00:00.000+00:00',
         endDate: '2024-09-19T00:00:00.000+00:00',
         jobPositionId: '67d79536b399f8267817e351',
         jobLevelId: '67d79536b399f8267817e351',
         avatarId: '67ee1298fe57e6ad8b48978d'
      })

      const buffer = await workbook.xlsx.writeBuffer()
      res.setHeader(
         'Content-Disposition',
         'attachment; filename=staff_list.xlsx'
      )
      res.setHeader(
         'Content-Type',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.send(buffer)
   }
}
