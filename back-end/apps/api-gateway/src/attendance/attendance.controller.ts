import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttendancePaginationDto } from 'common/dto/attendace.dto';

@Controller('attendances')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @Get('/recent/:employeeId')
    recent(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
        return this.attendanceService.recent(employeeId);
    }

    @Post('/checkin')
    @UseInterceptors(FileInterceptor('file'))
    checkIn(
        @Body('employee_id', ParseUUIDPipe) employeeId: string,
        @UploadedFile()
        file: Express.Multer.File,
    ) {
        return this.attendanceService.checkIn(employeeId, file.path);
    }

    @Get('/list')
    list(@Body() dto: AttendancePaginationDto) {
        return this.attendanceService.list(dto);
    }
}
