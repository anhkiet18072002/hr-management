import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { AppService } from 'src/app.service'
import { Swagger } from 'src/common/decorator/swagger/swagger.decorator'
import { Public } from 'src/core/decorator/public.decorator'

@Swagger('API')
@Controller('api')
export class AppController {
   constructor(private readonly appService: AppService) {}

   @ApiOperation({ summary: 'Get all api module routes' })
   @Public()
   @Get('routes')
   findAll() {
      return this.appService.findAll()
   }
}
