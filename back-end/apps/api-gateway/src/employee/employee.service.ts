import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMPLOYEE_SERVICE } from 'common/const';
import {
    CreateEmployeeDto,
    GetEmployeesDto,
    UpdateEmployeeDto,
} from 'common/dto/employee.dto';
import { Employee } from 'generated/prisma/client';
import {
    CREATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    GET_EMPLOYEE_BY_ID,
    GET_EMPLOYEES,
    UPDATE_EMPLOYEE,
} from 'libs/common/const';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmployeeService {
    constructor(
        @Inject(EMPLOYEE_SERVICE)
        private readonly clientEmployeeService: ClientProxy,
    ) {}

    async getEmployees(dto: GetEmployeesDto) {
        return await firstValueFrom(
            this.clientEmployeeService.send<Employee[]>(GET_EMPLOYEES, {
                data: dto,
            }),
        );
    }

    async getEmployeeById(employeeId: string) {
        return await firstValueFrom(
            this.clientEmployeeService.send<Employee>(GET_EMPLOYEE_BY_ID, {
                id: employeeId,
            }),
        );
    }

    async createEmployee(dto: CreateEmployeeDto) {
        return await firstValueFrom(
            this.clientEmployeeService.send<Employee>(CREATE_EMPLOYEE, {
                data: dto,
            }),
        );
    }

    async updateEmployee(employeeId: string, dto: UpdateEmployeeDto) {
        return await firstValueFrom(
            this.clientEmployeeService.send<Employee>(UPDATE_EMPLOYEE, {
                id: employeeId,
                data: dto,
            }),
        );
    }

    async deleteEmployee(employeeId: string) {
        return await firstValueFrom(
            this.clientEmployeeService.send<Employee>(DELETE_EMPLOYEE, {
                id: employeeId,
            }),
        );
    }
}
