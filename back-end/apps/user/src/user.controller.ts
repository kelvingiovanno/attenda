import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'common/dto/user.dto';

@Controller()
export class UserController {
    constructor(private readonly authService: UserService) {}

    @MessagePattern('auth_get_username')
    getUserByUsername(@Payload('username') username: string) {
        return this.authService.getUserByUsername(username);
    }

    @MessagePattern('auth_create_user')
    createUser(@Payload('data') dto: CreateUserDto) {
        return this.authService.createUser(dto);
    }
}
