import { ApiProperty } from '@nestjs/swagger'
import { Prisma, ProjectAssignment, ProjectStatusEnum } from '@prisma/client'
import {
   IsDateString,
   IsEnum,
   IsMongoId,
   IsNotEmpty,
   IsOptional,
   IsString
} from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateProjectDto extends CreateBaseDto {
   @ApiProperty({ description: 'Name of the project', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Description of the project',
      required: false
   })
   @IsString()
   @IsOptional()
   description?: string

   @ApiProperty({
      description: 'Priority of the project',
      required: false
   })
   @IsString()
   @IsOptional()
   priority?: string

   @ApiProperty({ description: 'Status of the project', required: true })
   @IsEnum(ProjectStatusEnum)
   @IsNotEmpty()
   status: ProjectStatusEnum

   @ApiProperty({ description: 'Type of the project', required: true })
   @IsMongoId()
   @IsNotEmpty()
   typeId: string

   @ApiProperty({ description: 'Price of the project', required: true })
   @IsMongoId()
   @IsNotEmpty()
   priceTypeId: string

   @ApiProperty({ description: 'Start date of the project', required: true })
   @IsDateString()
   @IsNotEmpty()
   startDate: string

   @ApiProperty({ description: 'End date of the project', required: false })
   @IsDateString()
   @IsOptional()
   endDate?: string

   @ApiProperty({
      description: 'Staff assigned for project',
      required: false
   })
   @IsOptional()
   projectAssignments?: ProjectAssignment[]
}
