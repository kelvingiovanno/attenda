import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { ConfigModule } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', '..', 'uploads'),
            serveRoot: '/media',
        }),
        EmployeeModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // UserClientModule,
        AttendanceModule,
        UserModule,
    ],
})
export class ApiGatewayModule {}
