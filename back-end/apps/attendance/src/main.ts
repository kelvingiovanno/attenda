import { NestFactory } from '@nestjs/core';
import { AttendanceModule } from './attendance.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        AttendanceModule,
        {
            useFactory: (configService: ConfigService) => ({
                transport: Transport.TCP,
                options: {
                    host: configService.get<string>('ATTENDANCE_SERVICE_HOST'),
                    port: configService.get<number>('ATTENDANCE_SERVICE_PORT'),
                    retryAttempts:
                        configService.get<number>('TCP_RETRY_ATTEMPTS'),
                },
            }),
            inject: [ConfigService],
        },
    );
    await app.listen();
}
void bootstrap();
