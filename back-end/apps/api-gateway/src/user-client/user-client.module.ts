import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from 'common/const';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: USER_SERVICE,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.getOrThrow<string>(
                            'USER_SERVICE_HOST',
                        ),
                        port: configService.getOrThrow<number>(
                            'USER_SERVICE_PORT',
                        ),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class UserClientModule {}
