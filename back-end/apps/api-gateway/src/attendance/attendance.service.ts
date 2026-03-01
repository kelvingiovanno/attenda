import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ATTENDANCE_SERVICE } from 'common/const';
import { AttendancePaginationDto } from 'common/dto/attendace.dto';
import { Attendance } from 'generated/prisma/client';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AttendanceService {
    constructor(
        @Inject(ATTENDANCE_SERVICE)
        private readonly attendanceService: ClientProxy,
    ) {}

    async recent(employeeId: string): Promise<Attendance[]> {
        try {
            const attendances = await firstValueFrom(
                this.attendanceService.send<Attendance[]>('attendance_recent', {
                    id: employeeId,
                }),
            );
            return attendances;
        } catch {
            throw new InternalServerErrorException('Something wrong...');
        }
    }

    async checkIn(employeeId: string, photoUrl: string) {
        try {
            const attendace = await firstValueFrom(
                this.attendanceService.send<Attendance>('attendance_check_in', {
                    id: employeeId,
                    photoUrl: photoUrl,
                }),
            );

            return attendace;
        } catch {
            throw new NotFoundException('Record not found.');
        }
    }

    async list(dto: AttendancePaginationDto) {
        try {
            const attendances = await firstValueFrom(
                this.attendanceService.send<Attendance[]>('attendance_list', {
                    data: dto,
                }),
            );

            return attendances;
        } catch {
            throw new InternalServerErrorException('Something wrong...');
        }
    }
}
