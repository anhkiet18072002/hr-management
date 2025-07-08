import { ApiProperty } from '@nestjs/swagger'
import {
   IsDateString,
   IsNotEmpty,
   IsNumber,
   IsString,
   Max,
   Min
} from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateLeaveAssignmentDto extends CreateBaseDto {
   @ApiProperty({
      description: 'The date that the staff takes leave',
      required: true
   })
   @IsDateString()
   @IsNotEmpty()
   startDate: Date

   @ApiProperty({
      description: 'The duration in minute that the staff takes leave',
      required: true
   })
   @IsNumber()
   @IsNotEmpty()
   @Max(40)
   @Min(0.125)
   duration: number

   @ApiProperty({
      description: 'ID of the staff that takes leave',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   staffId: string

   @ApiProperty({
      description: 'ID of the leave type that takes leave',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   typeId: string
}
