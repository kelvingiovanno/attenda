import { NestFactory } from '@nestjs/core';
import { AttendanceModule } from './attendance.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RpcValidationErrorException } from 'common/errors/rpc-error';
import { ResponseInterceptor } from './interceptor/response.interceptor';

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

    app.useGlobalInterceptors(new ResponseInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory(errors) {
                throw new RpcValidationErrorException(
                    'Validation error.',
                    errors.map((e) => Object.values(e.constraints!)).flat(),
                );
            },
        }),
    );

    await app.listen();

    const configService = app.get(ConfigService);
    const host = configService.getOrThrow<string>('ATTENDANCE_SERVICE_HOST');
    const port = configService.getOrThrow<string>('ATTENDANCE_SERVICE_PORT');

    console.log(`ATTENDANCE MICROSERVICE RUNNING ON ${host}:${port}`);
}
void bootstrap();
