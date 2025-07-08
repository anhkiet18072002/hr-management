import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAccountRoleDto {
   @ApiProperty({
      description: 'ID of the account that assigned role',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   accountId: string

   @ApiProperty({
      description: 'ID of the role that want to assign',
      required: true
   })
   @IsString()
   @IsNotEmpty()
   roleId: string
}
