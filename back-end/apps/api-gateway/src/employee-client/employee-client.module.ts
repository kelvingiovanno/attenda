import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'EMPLOYEE_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.getOrThrow<string>(
                            'EMPLOYEE_SERVICE_HOST',
                        ),
                        port: configService.getOrThrow<number>(
                            'EMPLOYEE_SERVICE_PORT',
                        ),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class EmployeeClientModule {}
