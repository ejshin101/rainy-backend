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
import { CreateUserPlntDto } from './dto/create-user-plnt.dto';
import { UpdateUserPlntDto } from './dto/update-user-plnt.dto';
import { executeResponseDto } from '../common/dto/executeResponse.dto';

@Controller('user')
export class UserPlntController {
  constructor(private readonly userPlntService: UserPlntService) {}

  @Get('/:userId/plants')
  findAll(
    @Param('userId') userId: number,
    @Query() userPlntResponseDto: UserPlntResponseDto,
  ): Promise<pagingResponseDto<UserPlnt>> {
    return this.userPlntService.findAll(userId, userPlntResponseDto);
  }

  @Get('/:userId/plants/:plantId')
  findById(
    @Param('userId') userId: number,
    @Param('plantId') plantId: number,
  ): Promise<UserPlnt> {
    return this.userPlntService.find(userId, plantId);
  }

  @Post('/:userId/plants')
  createPlant(
    @Param('userId') userId: number,
    @Body() createUserPlntDto: CreateUserPlntDto,
  ): Promise<executeResponseDto> {
    return this.userPlntService.create(userId, createUserPlntDto);
  }

  @Put('/:userId/plants/:plantId')
  updatePlant(
    @Param('userId') userId: number,
    @Param('plantId') plantId: number,
    @Body() updateUserPlntDto: UpdateUserPlntDto,
  ): Promise<executeResponseDto> {
    return this.userPlntService.update(userId, plantId, updateUserPlntDto);
  }

  @Delete('/:userId/plants/:plantId')
  delete(
    @Param('userId') userId: number,
    @Param('plantId') plantId: number,
  ): Promise<executeResponseDto> {
    return this.userPlntService.delete(userId, plantId);
  }
}
