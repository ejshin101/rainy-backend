import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PlntJrnlController } from './plnt-jrnl.controller';
import { plntJrnlRepository } from './plnt-jrnl.repository';
import { PlntJrnlService } from './plnt-jrnl.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PlntJrnlController],
  providers: [...plntJrnlRepository, PlntJrnlService],
})
export class PlntJrnlModule {}
