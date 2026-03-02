import { Controller } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendancePaginationDto } from 'common/dto/attendace.dto';
import {
    ATTENDANCE_CHECKIN,
    ATTENDANCE_LIST,
    ATTENDANCE_RECENT,
} from 'libs/common/const';

@Controller()
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @MessagePattern(ATTENDANCE_RECENT)
    recent(@Payload('id') employeeId: string) {
        return this.attendanceService.recent(employeeId);
    }

    @MessagePattern(ATTENDANCE_CHECKIN)
    checkin(
        @Payload('id') employeeId: string,
        @Payload('photoUrl') photoUrl: string,
    ) {
        return this.attendanceService.checkIn(employeeId, photoUrl);
    }

    @MessagePattern(ATTENDANCE_LIST)
    list(@Payload('data') dto: AttendancePaginationDto) {
        return this.attendanceService.list(dto);
    }
}
