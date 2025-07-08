import {
   CallHandler,
   ExecutionContext,
   Injectable,
   InternalServerErrorException,
   NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { DashboardService } from 'src/dashboard/dashboard.service'

@Injectable()
export class DashboardInterceptor implements NestInterceptor {
   constructor(private readonly dashboardService: DashboardService) {} // Inject service

   async intercept(
      context: ExecutionContext,
      next: CallHandler
   ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest()
      const method = request.method
      const url = request.url // Lấy URL request

      // Chỉ trigger nếu URL chứa 'project' và là POST, PUT, PATCH, DELETE
      if (
         url.includes('/project') &&
         ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
      ) {
         return next.handle().pipe(
            tap(async () => {
               try {
                  await this.dashboardService.update('project') // Gọi service thay vì axios
               } catch (error) {
                  throw new InternalServerErrorException()
               }
            })
         )
      }

      if (
         url.includes('/skill') &&
         ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
      ) {
         return next.handle().pipe(
            tap(async () => {
               try {
                  await this.dashboardService.update('skill') // Gọi service thay vì axios
               } catch (error) {
                  throw new InternalServerErrorException()
               }
            })
         )
      }

      return next.handle()
   }
}
