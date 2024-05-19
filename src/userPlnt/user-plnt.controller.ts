import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserPlntService } from './user-plnt.service';
import { UserPlntResponseDto } from './dto/user-plnt-response.dto';
import { pagingResponseDto } from '../common/dto/pagingResponse.dto';
import { UserPlnt } from './user-plnt.entity';
import {
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { CreateUserPlntDto } from './dto/create-user-plnt.dto';
import { UpdateUserPlntDto } from './dto/update-user-plnt.dto';
import { User } from '../user/user.entity';
import { executeResponseDto } from '../common/dto/executeResponse.dto';

@Controller('userplnt')
export class UserPlntController {
  constructor(private readonly userPlntService: UserPlntService) {}

  @Get()
  findAll(
    @Query() userPlntResponseDto: UserPlntResponseDto,
  ): Promise<pagingResponseDto<UserPlnt>> {
    return this.userPlntService.findAll(userPlntResponseDto);
  }

  @Get('/:id')
  findById(@Param('id') id: number): Promise<UserPlnt> {
    return this.userPlntService.find(id);
  }

  @Post()
  createPlant(@Body() createUserPlntDto: CreateUserPlntDto): Promise<executeResponseDto> {
    return this.userPlntService.create(createUserPlntDto);
  }

  @Put('/:id')
  updatePlant(
    @Param('id') id: number,
    @Body() updateUserPlntDto: UpdateUserPlntDto,
  ): Promise<executeResponseDto> {
    return this.userPlntService.update(id, updateUserPlntDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: number): Promise<executeResponseDto> {
    return this.userPlntService.delete(id);
  }
}
