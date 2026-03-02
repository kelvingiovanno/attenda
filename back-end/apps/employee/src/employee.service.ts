import { Injectable } from '@nestjs/common';
import { Employee } from 'generated/prisma/browser';
import { PrismaService } from '@app/prisma';
import {
    CreateEmployeeDto,
    GetEmployeesDto,
    UpdateEmployeeDto,
} from 'common/dto/employee.dto';
import { RpcConflictException, RpcNotFoundException } from 'libs/common/error';

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
            throw new RpcNotFoundException('Employee not found.');
        }

        return employee;
    }

    async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
        const isEmailUnique = await this.prisma.employee.findUnique({
            where: { email: data.email },
        });

        if (isEmailUnique) {
            throw new RpcConflictException('Email already registered.');
        }

        const newEmployee = await this.prisma.employee.create({
            data: data,
        });

        return newEmployee;
    }

    async updateEmployee(
        id: string,
        data: UpdateEmployeeDto,
    ): Promise<Employee> {
        const employee = await this.prisma.employee.findUnique({
            where: { id: id },
        });

        if (!employee) {
            throw new RpcNotFoundException('Employee not found.');
        }

        if (data.email) {
            const isEmployeeEmailUnique = await this.prisma.employee.findUnique(
                {
                    where: { email: data.email },
                },
            );

            if (isEmployeeEmailUnique) {
                throw new RpcConflictException('Email already registered');
            }
        }

        const updateEmployee = await this.prisma.employee.update({
            where: { id: id },
            data: data,
        });

        return updateEmployee;
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const employee = await this.prisma.employee.findUnique({
            where: {
                id: id,
                deletedAt: null,
            },
        });

        if (!employee) {
            throw new RpcNotFoundException('Employee not found.');
        }

        const deletedEmployee = await this.prisma.employee.update({
            where: { id: id },
            data: {
                deletedAt: new Date(),
            },
        });

        return deletedEmployee;
    }
}
