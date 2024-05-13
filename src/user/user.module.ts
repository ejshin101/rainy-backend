import { Module } from '@nestjs/common';
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { userRepository} from "./user.repository";
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [...userRepository, UserService],
})
export class UserModule {}
