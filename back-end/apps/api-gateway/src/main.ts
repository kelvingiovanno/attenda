import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(ApiGatewayModule);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('API_GATEWAY_PORT');

    await app.listen(port);

    console.log(`🚀 API Gateway is running on: http://localhost:${port}`);
}

void bootstrap();
