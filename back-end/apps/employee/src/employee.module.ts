import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PrismaModule, PrismaService } from '@app/prisma';

@Module({
    imports: [PrismaModule],
    controllers: [EmployeeController],
    providers: [EmployeeService, PrismaService],
})
export class EmployeeModule {}
