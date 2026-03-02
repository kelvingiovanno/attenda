import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AttendancePaginationDto } from 'common/dto/attendace.dto';
import { Attendance } from 'generated/prisma/client';
import {
    ATTENDANCE_CHECKIN,
    ATTENDANCE_LIST,
    ATTENDANCE_RECENT,
    ATTENDANCE_SERVICE,
} from 'libs/common/const';
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
                this.attendanceService.send<Attendance[]>(ATTENDANCE_RECENT, {
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
                this.attendanceService.send<Attendance>(ATTENDANCE_CHECKIN, {
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
                this.attendanceService.send<Attendance[]>(ATTENDANCE_LIST, {
                    data: dto,
                }),
            );

            return attendances;
        } catch {
            throw new InternalServerErrorException('Something wrong...');
        }
    }
}
