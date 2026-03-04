import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcUnauthorizedException } from 'libs/common/error';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async signIn(username: string, password: string) {
        const user = await this.prismaService.user.findUnique({
            where: { username: username },
        });

        if (!user || user.password !== password) {
            throw new RpcUnauthorizedException('Invalid username or password.');
        }

        const accessToken = await this.jwtService.signAsync(
            {
                id: user.id,
                role: user.role,
            },
            {
                expiresIn:
                    this.configService.getOrThrow<number>('JWT_EXPIRES_IN'),
            },
        );

        return {
            token: accessToken,
        };
    }
}
