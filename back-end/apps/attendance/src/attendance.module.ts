import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { PrismaModule, PrismaService } from '@app/prisma';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        PrismaModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/media',
        }),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService, PrismaService],
})
export class AttendanceModule {}
