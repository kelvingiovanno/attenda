import { Controller } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    CreateEmployeeDto,
    GetEmployeesDto,
    UpdateEmployeeDto,
} from 'common/dto/employee.dto';
import {
    CREATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    GET_EMPLOYEE_BY_ID,
    GET_EMPLOYEES,
    UPDATE_EMPLOYEE,
} from 'libs/common/const';

@Controller()
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @MessagePattern(GET_EMPLOYEES)
    async getEmployees(@Payload('data') dto: GetEmployeesDto) {
        return this.employeeService.getEmployees(dto);
    }

    @MessagePattern(GET_EMPLOYEE_BY_ID)
    async getEmployeeById(@Payload('id') id: string) {
        return this.employeeService.getEmployeeById(id);
    }

    @MessagePattern(CREATE_EMPLOYEE)
    async createEmployee(@Payload('data') dto: CreateEmployeeDto) {
        return this.employeeService.createEmployee(dto);
    }

    @MessagePattern(UPDATE_EMPLOYEE)
    async updateEmployee(
        @Payload('id') id: string,
        @Payload('data') dto: UpdateEmployeeDto,
    ) {
        return this.employeeService.updateEmployee(id, dto);
    }

    @MessagePattern(DELETE_EMPLOYEE)
    async deleteEmployee(@Payload('id') id: string) {
        return this.employeeService.deleteEmployee(id);
    }
}
