import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Employee } from 'generated/prisma/browser';
import {
    EmployeeCreateInput,
    EmployeeUpdateInput,
} from 'generated/prisma/models';
import {
    RpcInternalErrorException,
    RpcNotRecordException,
} from 'common/errors/rpc-error';
import { PrismaService } from '@app/prisma';
import { GetEmployeesDto } from 'common/dto/employee.dto';

@Injectable()
export class EmployeeService {
    constructor(private readonly prisma: PrismaService) {}

    async getEmployees(dto: GetEmployeesDto): Promise<Employee[]> {
        const { page = 1, limit = 10 } = dto;

        return await this.prisma.employee.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: {
                deletedAt: null,
            },
        });
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employee = await this.prisma.employee.findUnique({
            where: {
                id: id,
                deletedAt: null,
            },
        });

        if (!employee) {
            throw new RpcNotRecordException('Employee not found.');
        }

        return employee;
    }

    async createEmployee(data: EmployeeCreateInput): Promise<Employee> {
        return await this.prisma.employee.create({
            data: data,
        });
    }

    async updateEmployee(
        id: string,
        data: EmployeeUpdateInput,
    ): Promise<Employee> {
        try {
            const employee = await this.prisma.employee.update({
                where: { id: id },
                data: data,
            });

            return employee;
        } catch (err) {
            if (
                err instanceof PrismaClientKnownRequestError &&
                err.code === '2025'
            ) {
                throw new RpcNotRecordException('Employee not found.');
            }

            throw new RpcInternalErrorException('Database error.');
        }
    }

    async deleteEmployee(id: string): Promise<Employee> {
        try {
            const employee = await this.prisma.employee.update({
                where: {
                    id: id,
                    deletedAt: null,
                },
                data: {
                    deletedAt: new Date(),
                },
            });

            return employee;
        } catch (err) {
            if (
                err instanceof PrismaClientKnownRequestError &&
                err.code === '2025'
            ) {
                throw new RpcNotRecordException('Employee not found.');
            }

            throw new RpcInternalErrorException('Database error.');
        }
    }
}
