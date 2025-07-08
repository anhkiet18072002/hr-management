import { Module } from '@nestjs/common'
import { StaffService } from './staff.service'
import { StaffController } from './staff.controller'
import { AccountService } from 'src/account/account.service'
import { FileStorageService } from 'src/file-storage/file-storage.service'

@Module({
   controllers: [StaffController],
   providers: [StaffService, AccountService, FileStorageService]
})
export class StaffModule {}
