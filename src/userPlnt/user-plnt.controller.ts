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

  @Get('/:userSno/plants')
  findAll(
    @Param('userSno') userSno: number,
    @Query() userPlntResponseDto: UserPlntResponseDto,
  ): Promise<pagingResponseDto<UserPlnt>> {
    return this.userPlntService.findAll(userSno, userPlntResponseDto);
  }

  @Get('/:userSno/plants/:userPlntSno')
  findById(
    @Param('userSno') userSno: number,
    @Param('userPlntSno') userPlntSno: number,
  ): Promise<UserPlnt> {
    return this.userPlntService.find(userSno, userPlntSno);
  }

  @Post('/:userSno/plants')
  create(
    @Param('userSno') userSno: number,
    @Body() createUserPlntDto: CreateUserPlntDto,
  ): Promise<executeResponseDto> {
    return this.userPlntService.create(userSno, createUserPlntDto);
  }

  @Put('/:userSno/plants/:userPlntSno')
  update(
    @Param('userSno') userSno: number,
    @Param('userPlntSno') userPlntSno: number,
    @Body() updateUserPlntDto: UpdateUserPlntDto,
  ): Promise<executeResponseDto> {
    return this.userPlntService.update(userSno, userPlntSno, updateUserPlntDto);
  }

  @Delete('/:userSno/plants/:userPlntSno')
  delete(
    @Param('userSno') userSno: number,
    @Param('userPlntSno') userPlntSno: number,
  ): Promise<executeResponseDto> {
    return this.userPlntService.delete(userSno, userPlntSno);
  }
}
