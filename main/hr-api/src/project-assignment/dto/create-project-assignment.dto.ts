import { ApiProperty } from '@nestjs/swagger'
import {
   IsBoolean,
   IsDateString,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString
} from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateProjectAssignmentDto extends CreateBaseDto {
   @ApiProperty({
      description: 'ID of the staff that takes project',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   staffId: string

   @ApiProperty({
      description: 'ID of the project that assigned the project',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   projectId: string

   @ApiProperty({
      description: 'ID of the Role assigned to the project',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   roleId: string

   @ApiProperty({
      description: 'Workload of the staff assigned to the project',
      required: true
   })
   @IsNumber()
   @IsNotEmpty()
   workload: number

   @ApiProperty({
      description: 'Start date of the project-assignment',
      required: true
   })
   @IsDateString()
   @IsNotEmpty()
   startDate: string

   @ApiProperty({
      description: 'End date of the project-assignment',
      required: false
   })
   @IsDateString()
   @IsOptional()
   endDate?: string
}
