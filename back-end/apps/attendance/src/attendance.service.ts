import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { AttendancePaginationDto } from 'common/dto/attendace.dto';
import { RpcNotRecordException } from 'common/errors/rpc-error';
import { Attendance, AttendanceStatus } from 'generated/prisma/client';

@Injectable()
export class AttendanceService {
    constructor(private readonly prismaService: PrismaService) {}

    async recent(employeeId: string): Promise<Attendance[]> {
        const attendances = await this.prismaService.attendance.findMany({
            where: {
                employeeId: employeeId,
            },
            orderBy: {
                checkIn: 'asc',
            },
            take: 3,
        });

        console.log(attendances);

        if (!attendances) {
            throw new RpcNotRecordException('Employee not found.');
        }

        return attendances;
    }

    async checkIn(employeeId: string, photoUrl: string): Promise<Attendance> {
        const now = new Date();

        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await this.prismaService.attendance.findFirst({
            where: {
                employeeId: employeeId,
                checkIn: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        if (attendance) {
            throw new RpcNotRecordException('Employee not found.');
        }

        const lateLimit = new Date(now);
        lateLimit.setHours(9, 0, 0, 0);

        const status =
            now > lateLimit ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

        const newAttendance = await this.prismaService.attendance.create({
            data: {
                employeeId: employeeId,
                checkIn: now,
                status: status,
                photoUrl: photoUrl,
            },
        });

        return newAttendance;
    }

    async list(dto: AttendancePaginationDto) {
        const date = new Date(dto.day);

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const attendances = await this.prismaService.attendance.findMany({
            where: {
                checkIn: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: {
                checkIn: 'desc',
            },
        });

        return attendances;
    }
}
