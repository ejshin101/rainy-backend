import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserPlntController } from './user-plnt.controller';
import { userPlntRepository } from './user-plnt.repository';
import { UserPlntService } from './user-plnt.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserPlntController],
  providers: [...userPlntRepository, UserPlntService],
})
export class UserPlntModule {}
