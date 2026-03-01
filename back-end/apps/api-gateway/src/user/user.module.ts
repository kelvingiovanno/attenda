import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserClientModule } from '../user-client/user-client.module';

@Module({
    controllers: [UserClientModule, UserController],
    providers: [UserService],
})
export class UserModule {}
