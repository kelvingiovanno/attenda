import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeeClientModule } from './employee-client/employee-client.module';
import { AttendanceClientModule } from './attendance-client/attendance-client.module';

@Module({
    imports: [
        EmployeeModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        EmployeeClientModule,
        AttendanceClientModule,
    ],
})
export class ApiGatewayModule {}
