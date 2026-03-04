import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RpcValidationErrorException } from 'common/errors/rpc-error';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        AuthModule,
        {
            useFactory: (configService: ConfigService) => ({
                transport: Transport.TCP,
                options: {
                    host: configService.getOrThrow<string>('AUTH_SERVICE_HOST'),
                    port: configService.getOrThrow<number>('AUTH_SERVICE_PORT'),
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
    const host = configService.getOrThrow<string>('ATTENDANCE_SERVICE_HOST');
    const port = configService.getOrThrow<string>('ATTENDANCE_SERVICE_PORT');

    console.log(`AUTH MICROSERVICE RUNNING ON ${host}:${port}`);
}

void bootstrap();
