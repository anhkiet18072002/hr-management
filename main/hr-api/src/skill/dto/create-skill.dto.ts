import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateSkillDto extends CreateBaseDto {
   @ApiProperty({ description: 'Name of the skill', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({ description: 'Description for the skill', required: false })
   @IsOptional()
   @IsString()
   description: string

   @ApiProperty({ description: 'ID of the file thumbnail', required: false })
   @IsMongoId()
   @IsOptional()
   thumbnailId?: string
}
