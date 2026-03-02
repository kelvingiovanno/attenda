import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { IsEmailUniqueValidator } from './providers/is-email-unique-validator';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [PrismaService, IsEmailUniqueValidator],
    exports: [PrismaService],
})
export class PrismaModule {}
