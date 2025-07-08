import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateBaseDto } from 'src/core/dto/create-base.dto'

export class CreateAccountDto extends CreateBaseDto {
   @ApiProperty({ description: 'Email of the account', required: true })
   @IsString()
   @IsNotEmpty()
   email: string

   @ApiProperty({ description: 'Password of the account', required: true })
   @IsString()
   @IsNotEmpty()
   password: string

   @ApiProperty({ description: 'Username of the account', required: true })
   @IsString()
   @IsNotEmpty()
   username: string

   @ApiProperty({ description: 'First name of the account', required: true })
   @IsString()
   @IsNotEmpty()
   firstName: string

   @ApiProperty({ description: 'First name of the account', required: true })
   @IsString()
   @IsNotEmpty()
   lastName: string

   @ApiProperty({ description: 'First name of the account', required: false })
   @IsString()
   @IsOptional()
   middleName?: string
}

export class FindUserByEmailDto {
   @ApiProperty({ description: 'Email of the user', required: true })
   @IsString()
   @IsNotEmpty()
   email: string
}
