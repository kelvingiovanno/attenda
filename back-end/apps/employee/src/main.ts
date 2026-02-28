import { NestFactory } from '@nestjs/core';
import { EmployeeModule } from './employee.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RpcValidationErrorException } from 'common/errors/rpc-error';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        EmployeeModule,
        {
            useFactory: (configService: ConfigService) => ({
                transport: Transport.TCP,
                options: {
                    host: configService.getOrThrow<string>(
                        'EMPLOYEE_SERVICE_HOST',
                    ),
                    port: configService.getOrThrow<number>(
                        'EMPLOYEE_SERVICE_PORT',
                    ),
                    retryAttempts:
                        configService.getOrThrow<number>('TCP_RETRY_ATTEMPTS'),
                },
            }),
            inject: [ConfigService],
        },
    );

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
    const host = configService.getOrThrow<string>('EMPLOYEE_SERVICE_HOST');
    const port = configService.getOrThrow<string>('EMPLOYEE_SERVICE_PORT');

    console.log(`EMPLOYEE MICROSERVICE RUNNING ON ${host}:${port}`);
}

void bootstrap();
