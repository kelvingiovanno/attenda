import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeClientModule } from '../employee-client/employee-client.module';

@Module({
    imports: [EmployeeClientModule],
    controllers: [EmployeeController],
    providers: [EmployeeService],
})
export class EmployeeModule {}
