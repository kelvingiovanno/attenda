import { Injectable } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueValidator implements ValidatorConstraintInterface {
    constructor(private prisma: PrismaService) {}

    async validate(email: string): Promise<boolean> {
        const user = await this.prisma.employee.findUnique({
            where: { email },
        });

        return !user;
    }

    defaultMessage(): string {
        return 'Email already exists';
    }
}
