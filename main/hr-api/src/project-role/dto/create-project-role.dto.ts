import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateProjectRoleDto extends CreateBaseDto {
   @ApiProperty({ description: 'Role in project', required: true })
   @IsString()
   @IsNotEmpty()
   name: string

   @ApiProperty({
      description: 'Description of role',
      required: false
   })
   @IsString()
   @IsOptional()
   description?: string
}
