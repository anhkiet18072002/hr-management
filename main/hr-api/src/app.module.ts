import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, DiscoveryModule } from '@nestjs/core'
import { AccountService } from 'src/account/account.service'
import { AppController } from 'src/app.controller'
import { AppService } from 'src/app.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { PermissionGuard } from 'src/auth/guards/permission.guard'
import { AccountRoleModule } from './account-role/account-role.module'
import { AccountModule } from './account/account.module'
import { AuthModule } from './auth/auth.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { FeatureModule } from './feature/feature.module'
import { FileStorageModule } from './file-storage/file-storage.module'
import { JobLevelModule } from './job-level/job-level.module'
import { JobPositionModule } from './job-position/job-position.module'
import { LeaveAssignmentModule } from './leave-assignment/leave-assignment.module'
import { LeaveTypeModule } from './leave-type/leave-type.module'
import { PermissionModule } from './permission/permission.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProjectAssignmentModule } from './project-assignment/project-assignment.module'
import { ProjectPriceTypeModule } from './project-price-type/project-price-type.module'
import { ProjectRoleModule } from './project-role/project-role.module'
import { ProjectTypeModule } from './project-type/project-type.module'
import { ProjectModule } from './project/project.module'
import { RoleAssignmentModule } from './role-assignment/role-assignment.module'
import { RoleFeaturePermissionModule } from './role-feature-permission/role-feature-permission.module'
import { RoleModule } from './role/role.module'
import { SkillAssignmentModule } from './skill-assignment/skill-assignment.module'
import { SkillLevelModule } from './skill-level/skill-level.module'
import { SkillModule } from './skill/skill.module'
import { StaffModule } from './staff/staff.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ObjectiveModule } from './objective/objective.module'
import { RoleGuard } from 'src/auth/guards/role.guard'
import { StaffKeyResultModule } from './staff_key_result/staff_key_result.module'
import { KeyResultModule } from './key_result/key_result.module'

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         cache: true,
         expandVariables: true
      }),
      ServeStaticModule.forRoot({
         rootPath: join(__dirname, '..', 'uploads'),
         serveRoot: '/uploads'
      }),
      AccountModule,
      AccountRoleModule,
      AuthModule,
      DashboardModule,
      DiscoveryModule,
      FeatureModule,
      FileStorageModule,
      JobLevelModule,
      JobPositionModule,
      LeaveAssignmentModule,
      LeaveTypeModule,
      PermissionModule,
      PrismaModule,
      ProjectAssignmentModule,
      ProjectModule,
      ProjectPriceTypeModule,
      ProjectRoleModule,
      ProjectTypeModule,
      RoleAssignmentModule,
      RoleFeaturePermissionModule,
      RoleModule,
      SkillAssignmentModule,
      SkillLevelModule,
      SkillModule,
      StaffModule,
      ObjectiveModule,
      StaffKeyResultModule,
      KeyResultModule
   ],
   controllers: [AppController],
   providers: [
      {
         provide: APP_GUARD,
         useClass: JwtAuthGuard
      },
      {
         provide: APP_GUARD,
         useClass: RoleGuard
      },
      {
         provide: APP_GUARD,
         useClass: PermissionGuard
      },
      AppService,
      AccountService
   ]
})
export class AppModule {}
