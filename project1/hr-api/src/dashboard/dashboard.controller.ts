import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete
} from '@nestjs/common'
import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
   constructor(private readonly dashboardService: DashboardService) {}

   @Post('project')
   createChartProject() {
      return this.dashboardService.CreateChartProject()
   }

   @Post('skill')
   createChartSkill() {
      return this.dashboardService.CreateChartSkill()
   }

   @Post('top_skill')
   createChartTopSkill() {
      return this.dashboardService.CreateChartTopSkill()
   }

   @Get(':chartId')
   findOne(@Param('chartId') chartId: string) {
      return this.dashboardService.GetOne(chartId)
   }

   @Patch(':chartId')
   update(@Param('chartId') chartId: string) {
      return this.dashboardService.update(chartId)
   }

   // @Delete(':id')
   // remove(@Param('id') id: string) {
   //   return this.dashboardService.remove(+id);
   // }
}
