import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMPLOYEE_SERVICE } from 'common/const';
import {
    CreateEmployeeDto,
    GetEmployeesDto,
    UpdateEmployeeDto,
} from 'common/dto/employee.dto';
import { isRpcError, RpcErrorCode } from 'common/errors/rpc-error';
import { Employee } from 'generated/prisma/client';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmployeeService {
    constructor(
        @Inject(EMPLOYEE_SERVICE)
        private readonly clientEmployeeService: ClientProxy,
    ) {}

    async getEmployees(dto: GetEmployeesDto) {
        try {
            return await firstValueFrom(
                this.clientEmployeeService.send<Employee[]>('get_employees', {
                    data: dto,
                }),
            );
        } catch {
            throw new InternalServerErrorException('Something wrong...');
        }
    }

    async getEmployeeById(employeeId: string) {
        try {
            return await firstValueFrom(
                this.clientEmployeeService.send<Employee>(
                    'get_employee_by_id',
                    {
                        id: employeeId,
                    },
                ),
            );
        } catch (err: unknown) {
            if (isRpcError(err) && err.code === RpcErrorCode.NOT_RECORD) {
                throw new NotFoundException('Not record found.');
            }

            throw new InternalServerErrorException('Something wrong...');
        }
    }

    async createEmployee(dto: CreateEmployeeDto) {
        try {
            return await firstValueFrom(
                this.clientEmployeeService.send<Employee>('create_employee', {
                    data: dto,
                }),
            );
        } catch (err: unknown) {
            if (isRpcError(err) && err.code === RpcErrorCode.NOT_RECORD) {
                throw new NotFoundException('Not record found.');
            }

            if (isRpcError(err) && err.code === RpcErrorCode.VALIDATION_ERROR) {
                throw new BadRequestException(err.message);
            }

            throw new InternalServerErrorException('Something wrong...');
        }
    }

    async updateEmployee(employeeId: string, dto: UpdateEmployeeDto) {
        try {
            return await firstValueFrom(
                this.clientEmployeeService.send<Employee>('update_employee', {
                    id: employeeId,
                    data: dto,
                }),
            );
        } catch (err: unknown) {
            if (isRpcError(err) && err.code === RpcErrorCode.NOT_RECORD) {
                throw new NotFoundException('Record not found.');
            }

            throw new InternalServerErrorException('Something wrong...');
        }
    }

    async deleteEmployee(employeeId: string) {
        try {
            return await firstValueFrom(
                this.clientEmployeeService.send<Employee>('delete_employee', {
                    id: employeeId,
                }),
            );
        } catch (err: unknown) {
            if (isRpcError(err) && err.code === RpcErrorCode.NOT_RECORD) {
                throw new NotFoundException('Record not found.');
            }

            throw new InternalServerErrorException();
        }
    }
}
