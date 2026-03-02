import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalRpcExceptionFilter } from './filter/globalException.filter';

async function bootstrap() {
    const app = await NestFactory.create(ApiGatewayModule);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('API_GATEWAY_PORT');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalFilters(new GlobalRpcExceptionFilter());

    await app.listen(port);

    console.log(`🚀 API Gateway is running on: http://localhost:${port}`);
}

void bootstrap();
