import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class AttendancePaginationDto {
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

    @IsDateString()
    day: string;
}
