import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateStaffKeyResultDto extends CreateBaseDto {
   @ApiProperty({ description: 'ID of staff', required: true })
   @IsString()
   @IsNotEmpty()
   staffId: string

   @ApiProperty({ description: 'ID of keyResult', required: true })
   @IsString()
   @IsNotEmpty()
   keyResultId: string

   @ApiProperty({ description: 'Is Complete', required: true, default: false })
   @IsBoolean()
   @IsNotEmpty()
   isComplete: boolean

   @ApiProperty({ description: 'Current value of staff', required: true })
   @IsNumber()
   @IsNotEmpty()
   currentValue: number
}
