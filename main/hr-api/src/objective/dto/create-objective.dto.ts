import { CreateBaseDto } from 'src/core/dto/create-base.dto'
import { ApiProperty } from '@nestjs/swagger'
import {
   IsDate,
   IsDateString,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString
} from 'class-validator'
import { CreateKeyResultDto } from 'src/key_result/dto/create-key_result.dto'

export class CreateObjectiveDto extends CreateBaseDto {
   @ApiProperty({ description: 'Tile of the objective', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Description of the objective',
      required: false
   })
   @IsString()
   @IsOptional()
   description: string

   @ApiProperty({ description: 'Start date of the objective', required: true })
   @IsDateString()
   @IsNotEmpty()
   startDate: string

   @ApiProperty({ description: 'End date of the objective', required: false })
   @IsDateString()
   @IsNotEmpty()
   endDate: string

   @ApiProperty({
      description: 'Progress of the objective',
      required: true,
      default: 0
   })
   @IsNumber()
   @IsNotEmpty()
   progress: number

   @ApiProperty({
      description: 'Set Key result for objective',
      required: false
   })
   @IsOptional()
   keyResults?: CreateKeyResultDto[]

   @ApiProperty({ description: 'ID of staff', required: true })
   @IsString()
   @IsNotEmpty()
   staffId: string
}
