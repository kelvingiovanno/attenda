import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    Max,
    IsNotEmpty,
    IsEmail,
    IsDateString,
    IsEnum,
    IsISO8601,
    Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeStatus } from 'generated/prisma/enums';

export class GetEmployeesDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    department: string;

    @IsString()
    @IsNotEmpty()
    position: string;

    @IsOptional()
    @IsISO8601({ strict: true })
    @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, {
        message:
            'Date must be in the format YYYY-MM-DDTHH:mm:ssZ (e.g., 2024-05-20T10:00:00Z)',
    })
    hireDate: string;

    @IsOptional()
    @IsEnum(EmployeeStatus as object)
    status?: EmployeeStatus;
}

export class UpdateEmployeeDto {
    @IsOptional()
    @IsString()
    fullname?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsDateString()
    hireDate?: string;

    @IsOptional()
    @IsEnum(EmployeeStatus as object)
    status?: EmployeeStatus;
}
