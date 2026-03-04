import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_LOGIN } from 'libs/common/const';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(AUTH_LOGIN)
    signIn(
        @Payload('username') username: string,
        @Payload('password') password: string,
    ) {
        return this.authService.signIn(username, password);
    }
}
