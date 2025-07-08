import { CreateBaseDto } from 'src/core/dto/create-base.dto'
import { ApiProperty } from '@nestjs/swagger'
import {
   IsDate,
   IsDateString,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString
} from 'class-validator'

export enum KeyResultType {
   NUMBER = 'NUMBER',
   BOOLEAN = 'BOOLEAN',
   PERCENT = 'PERCENT'
}

export class CreateKeyResultDto extends CreateBaseDto {
   @ApiProperty({ description: 'Id of the key result', required: false })
   @IsOptional()
   id: string

   @ApiProperty({ description: 'Name of the key result', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Type of Key Result',
      required: true,
      enum: ['number', 'boolean', 'percent']
   })
   @IsEnum(KeyResultType)
   type: KeyResultType

   @ApiProperty({ description: 'Tile of the objective', required: true })
   @IsNumber()
   @IsNotEmpty()
   value: number

   @ApiProperty({ description: 'Deadline of the Key Result', required: true })
   @IsDateString()
   @IsNotEmpty()
   deadline: string

   @ApiProperty({ description: 'ID of staff', required: true })
   @IsString()
   @IsNotEmpty()
   staffId: string

   @ApiProperty({ description: 'ID of objective', required: true })
   @IsString()
   @IsNotEmpty()
   objectiveId: string

   numberData: {
      target: number
   }

   booleanData?: {} // Không có field cụ thể, chỉ cần có nếu type = BOOLEAN

   percentData?: {
      targetPercent: number
   }
}
