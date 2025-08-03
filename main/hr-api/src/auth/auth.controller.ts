import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { SignInDto } from 'src/auth/dto/signin.dto'
import { LocalAuthGuard } from 'src/auth/guards'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { Public } from 'src/core/decorator/public.decorator'
import { AuthService } from './auth.service'

@Swagger('Auth')
@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) { }

   @ApiOperation({ summary: 'Sign in' })
   @Public()
   @UseGuards(LocalAuthGuard)
   @Post('login')
   signIn(@Body() dto: SignInDto) {
      return this.authService.validate(dto)
   }
}
