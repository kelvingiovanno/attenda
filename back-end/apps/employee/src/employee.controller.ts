import { Controller } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    CreateEmployeeDto,
    GetEmployeesDto,
    UpdateEmployeeDto,
} from 'common/dto/employee.dto';

@Controller()
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @MessagePattern('get_employees')
    async getEmployees(@Payload('data') dto: GetEmployeesDto) {
        return this.employeeService.getEmployees(dto);
    }

    @MessagePattern('get_employee_by_id')
    async getEmployeeById(@Payload('id') id: string) {
        return this.employeeService.getEmployeeById(id);
    }

    @MessagePattern('create_employee')
    async createEmployee(@Payload('data') dto: CreateEmployeeDto) {
        return this.employeeService.createEmployee(dto);
    }

    @MessagePattern('update_employee')
    async updateEmployee(
        @Payload('id') id: string,
        @Payload('data') dto: UpdateEmployeeDto,
    ) {
        return this.employeeService.updateEmployee(id, dto);
    }

    @MessagePattern('delete_employee')
    async deleteEmployee(@Payload('id') id: string) {
        return this.employeeService.deleteEmployee(id);
    }
}
