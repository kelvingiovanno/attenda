import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import {
    CreateEmployeeDto,
    GetEmployeesDto,
    UpdateEmployeeDto,
} from 'common/dto/employee.dto';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get()
    getEmployees(@Body() dto: GetEmployeesDto) {
        return this.employeeService.getEmployees(dto);
    }

    @Get(':employeeId')
    getEmployeeById(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
        return this.employeeService.getEmployeeById(employeeId);
    }

    @Post()
    createEmployee(@Body() dto: CreateEmployeeDto) {
        return this.employeeService.createEmployee(dto);
    }

    @Patch(':employeeId')
    upddateEmployee(
        @Param('employeeId', ParseUUIDPipe) employeeId: string,
        @Body() dto: UpdateEmployeeDto,
    ) {
        return this.employeeService.updateEmployee(employeeId, dto);
    }

    @Delete(':employeeId')
    deleteEmployee(@Param('employeeId', ParseUUIDPipe) employeeId: string) {
        return this.employeeService.deleteEmployee(employeeId);
    }
}
