import { Controller } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendancePaginationDto } from 'common/dto/attendace.dto';

@Controller()
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @MessagePattern('attendance_recent')
    recent(@Payload('id') employeeId: string) {
        return this.attendanceService.recent(employeeId);
    }

    @MessagePattern('attendance_check_in')
    checkin(
        @Payload('id') employeeId: string,
        @Payload('photoUrl') photoUrl: string,
    ) {
        return this.attendanceService.checkIn(employeeId, photoUrl);
    }

    @MessagePattern('attendance_list')
    list(@Payload('data') dto: AttendancePaginationDto) {
        return this.attendanceService.list(dto);
    }
}
