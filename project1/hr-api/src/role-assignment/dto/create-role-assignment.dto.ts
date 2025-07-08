import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsMongoId, IsNotEmpty } from 'class-validator'

export class CreateRoleAssignmentDto {
   @ApiProperty({
      description: 'User account ID of the user that is assigned new role'
   })
   @IsMongoId()
   @IsNotEmpty()
   accountId: string

   @ApiProperty({
      description: 'Role ID or array of Role ID that assigns to user account'
   })
   @IsMongoId({ each: true })
   @ArrayMinSize(1)
   roleId: string[]
}
