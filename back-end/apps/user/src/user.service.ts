import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'common/dto/user.dto';
import {
    RpcInternalErrorException,
    RpcNotRecordException,
} from 'common/errors/rpc-error';
import { User, UserRole } from 'generated/prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            throw new RpcNotRecordException('User not found');
        }

        return user;
    }

    async createUser(dto: CreateUserDto): Promise<User> {
        try {
            const user = await this.prismaService.user.create({
                data: {
                    employeeId: dto.employee_id,
                    username: dto.username,
                    password: dto.password,
                    role: UserRole.EMPLOYEE,
                },
            });

            return user;
        } catch {
            throw new RpcInternalErrorException('Something wrong...');
        }
    }
}
