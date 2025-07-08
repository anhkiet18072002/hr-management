import { ApiProperty } from '@nestjs/swagger'
import { SkillAssignment, StaffKeyResult } from '@prisma/client'
import {
   IsDateString,
   IsMongoId,
   IsNotEmpty,
   IsOptional,
   IsString
} from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateStaffDto extends CreateBaseDto {
   @ApiProperty({ description: 'Email of the staff', required: true })
   @IsString()
   @IsNotEmpty()
   email: string

   @ApiProperty({ description: 'Password of the staff', required: true })
   @IsString()
   @IsNotEmpty()
   password: string

   @ApiProperty({ description: 'Username of the staff', required: false })
   @IsString()
   @IsNotEmpty()
   username: string

   @ApiProperty({ description: 'First name of the staff', required: true })
   @IsString()
   @IsNotEmpty()
   firstName: string

   @ApiProperty({ description: 'Last name of the staff', required: true })
   @IsString()
   @IsNotEmpty()
   lastName: string

   @ApiProperty({ description: 'Last name of the staff', required: false })
   @IsString()
   @IsOptional()
   middleName?: string

   @ApiProperty({ description: 'Start date of the staff', required: true })
   @IsDateString()
   @IsOptional()
   startDate: string

   @ApiProperty({ description: 'End date of the staff', required: false })
   @IsDateString()
   @IsOptional()
   endDate?: string

   @ApiProperty({ description: 'ID of the file avatar', required: false })
   @IsOptional()
   avatarId?: string

   @ApiProperty({
      description: 'Job position ID of staff ',
      required: false
   })
   @IsString()
   @IsOptional()
   jobPositionId?: string

   @ApiProperty({
      description: 'Job level ID of staff ',
      required: false
   })
   @IsString()
   @IsOptional()
   jobLevelId?: string

   @ApiProperty({
      description: 'Skill set of staff',
      required: false
   })
   @IsOptional()
   skillAssignments?: SkillAssignment[]

   @ApiProperty({
      description: 'Key Result of staff',
      required: false
   })
   @IsOptional()
   staffKeyResults?: StaffKeyResult[]

   @ApiProperty({
      description: 'Objective ID of staff ',
      required: false
   })
   @IsString()
   @IsOptional()
   objectiveId?: string
}
