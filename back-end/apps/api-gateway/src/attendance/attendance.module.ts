import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceClientModule } from '../attendance-client/attendance-client.module';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
    imports: [AttendanceClientModule, FileUploadModule],
    controllers: [AttendanceController],
    providers: [AttendanceService],
})
export class AttendanceModule {}
