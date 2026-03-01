import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ATTENDANCE_SERVICE } from 'common/const';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: ATTENDANCE_SERVICE,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.getOrThrow<string>(
                            'ATTENDANCE_SERVICE_HOST',
                        ),
                        port: configService.getOrThrow<number>(
                            'ATTENDANCE_SERVICE_PORT',
                        ),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class AttendanceClientModule {}
