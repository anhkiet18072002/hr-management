import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateSkillAssignmentDto extends CreateBaseDto {
   @ApiProperty({ description: 'Job level of staff for skill', required: true })
   @IsMongoId()
   @IsNotEmpty()
   levelId: string

   @ApiProperty({ description: 'Primary or Secondary', required: true })
   @IsBoolean()
   @IsNotEmpty()
   primary: boolean

   @ApiProperty({ description: 'Year of Experience', required: true })
   @IsNumber()
   @IsNotEmpty()
   yearOfExp: number

   @ApiProperty({ description: 'Id of staff', required: true })
   @IsMongoId()
   @IsNotEmpty()
   staffId: string

   @ApiProperty({ description: 'Id of skill', required: true })
   @IsMongoId()
   @IsNotEmpty()
   skillId: string
}
