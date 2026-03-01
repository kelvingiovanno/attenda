import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from 'generated/prisma/client';

export class CreateUserDto {
    @IsString()
    employee_id: string;

    @IsString()
    @MinLength(4)
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole;
}
